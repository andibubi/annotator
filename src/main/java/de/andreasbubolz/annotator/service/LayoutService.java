package de.andreasbubolz.annotator.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.andreasbubolz.annotator.domain.GridElement;
import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.domain.User;
import de.andreasbubolz.annotator.repository.GridElementRepository;
import de.andreasbubolz.annotator.repository.LayoutRepository;
import de.andreasbubolz.annotator.service.dto.GridElementDTO;
import de.andreasbubolz.annotator.service.dto.LayoutDTO;
import de.andreasbubolz.annotator.service.mapper.LayoutMapper;
import de.andreasbubolz.annotator.web.rest.UserUtil;
import jakarta.persistence.EntityManager;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.control.DeepClone;
import org.mapstruct.factory.Mappers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Service Implementation for managing {@link de.andreasbubolz.annotator.domain.Layout}.
 */
@Service
@Transactional
public class LayoutService {

    private static final Logger log = LoggerFactory.getLogger(LayoutService.class);
    public static final int Y_DELTA = -20;

    private final LayoutRepository layoutRepository;
    private final GridElementService gridElementService;
    private final GridElementRepository gridElementRepository;

    private final LayoutMapper layoutMapper;
    private final UserUtil userUtil;
    private final EntityManager entityManager;

    public LayoutService(
        LayoutRepository layoutRepository,
        GridElementService gridElementService,
        GridElementRepository gridElementRepository,
        LayoutMapper layoutMapper,
        UserUtil userUtil,
        EntityManager entityManager
    ) {
        this.layoutRepository = layoutRepository;
        this.gridElementService = gridElementService;
        this.gridElementRepository = gridElementRepository;
        this.layoutMapper = layoutMapper;
        this.userUtil = userUtil;
        this.entityManager = entityManager;
    }

    public static class JsonContent {

        public JsonCommand[] commands;
    }

    public static class JsonCommand {

        public Long timeSec;
        public Long x;
        public Long y;
        public Long w;
        public Long h;
        public String text;
        public String videoId;
    }

    @Mapper(mappingControl = DeepClone.class)
    public interface GridElementCloner {
        GridElementCloner INSTANCE = Mappers.getMapper(GridElementCloner.class);

        @Mapping(target = "id", ignore = true)
        @Mapping(target = "layout", ignore = true)
        GridElement clone(GridElement in);
    }

    // return LayoutId
    public Long createOrUpdateGridElement(String commandStr, @RequestParam Long layoutId) throws JsonProcessingException {
        // TODO gridElements und layout sollten per JPA mit einem Methodenaufruf gesichert werden können
        var currentUser = userUtil.getCurrentUser();
        var orgGridElements = gridElementRepository.findByLayoutId(layoutId);
        var command = new ObjectMapper().readValue(commandStr, JsonCommand.class);
        if (true) {
            //if (!layout.getUser().getId().equals(currentUser.getId())) {
            // TODO Übler Hack: Bei Besitzwechsel wird im Ergebnis ein neu angelegtes Layout referenziert
            var newGridElements = new HashSet<GridElement>();
            var newLayout = new Layout().user(currentUser);

            for (var orgGridElement : orgGridElements) {
                // TODO Sollte per JPA schöner gehen (s.o.)
                var newGridElement = GridElementCloner.INSTANCE.clone(orgGridElement);
                newGridElements.add(newGridElement);
                newGridElement.setLayout(newLayout);
                if (newGridElement.getChannel().equals("cmt")) {
                    var newCmtGridElement = GridElementCloner.INSTANCE.clone(newGridElement);
                    newGridElement.setChannel("fix");
                    newGridElements.add(newCmtGridElement);
                    newCmtGridElement.setY(newCmtGridElement.getY() + Y_DELTA);
                    var orgCmtContent = new ObjectMapper().readValue(newCmtGridElement.getContent(), JsonContent.class);
                    JsonCommand lastCommandWithPosition = null;
                    for (var orgCommand : orgCmtContent.commands) if (orgCommand.x != null) lastCommandWithPosition = orgCommand;
                    var newCmtContent = new JsonContent();
                    if (lastCommandWithPosition != null) {
                        newCmtContent.commands = new JsonCommand[2];
                        var newPosCommand = new JsonCommand();
                        newCmtContent.commands[0] = newPosCommand;
                        newPosCommand.timeSec = 0L;
                        newPosCommand.x = lastCommandWithPosition.x;
                        newPosCommand.y = lastCommandWithPosition.y + Y_DELTA;
                        newPosCommand.w = lastCommandWithPosition.w;
                        newPosCommand.h = lastCommandWithPosition.h;
                    } else newCmtContent.commands = new JsonCommand[1];

                    var newTextCommand = new JsonCommand();
                    newCmtContent.commands[newCmtContent.commands.length - 1] = newTextCommand;
                    newTextCommand.timeSec = command.timeSec;
                    newTextCommand.text = command.text;
                    newCmtGridElement.setContent(new ObjectMapper().writeValueAsString(newCmtContent));
                }
            }
            newLayout.setGridElements(newGridElements);

            layoutRepository.save(newLayout);
            for (var recylcledGridElement : newGridElements) gridElementRepository.save(recylcledGridElement);
            layoutId = newLayout.getId();
        } else {
            var gridElement = orgGridElements.stream().filter(g -> g.getChannel().equals("cmt")).findFirst().get();
            var orgCmtContent = new ObjectMapper().readValue(gridElement.getContent(), JsonContent.class);

            var newCmtContent = new JsonContent();
            newCmtContent.commands = new JsonCommand[orgCmtContent.commands.length + 1];
            for (var idx = 0; idx < orgCmtContent.commands.length; idx++) newCmtContent.commands[idx] = orgCmtContent.commands[idx];
            newCmtContent.commands[newCmtContent.commands.length - 1] = command;
            gridElement.setContent(new ObjectMapper().writeValueAsString(newCmtContent));
            gridElementRepository.save(gridElement);
        }
        return layoutId;
    }

    private Set<GridElement> transform(Set<GridElement> gridElements) {
        var result = new HashSet<GridElement>();
        for (var gridElement : gridElements) {
            // TODO Sollte per JPA schöner gehen (s.o.)
            entityManager.detach(gridElement);
            gridElement.setId(null);
            //entityManager.merge(gridElement);
            result.add(gridElement);
        }
        return result;
    }

    /**
     * Save a layout.
     *
     * @param user
     * @param layoutDTO the entity to save.
     * @param videoId
     * @return the persisted entity.
     */
    public LayoutDTO createLayoutWithSomeGridItems(User user, LayoutDTO layoutDTO, String videoId) {
        log.debug("Request to save Layout : {}", layoutDTO);
        var savedLayoutDto = layoutMapper.toDto(createLayout(user, layoutDTO));

        createGridElement(
            videoId,
            savedLayoutDto,
            "y1",
            "app-yt-player",
            0,
            0,
            12,
            6,
            "{\"commands\": [{ \"timeSec\": 0, \"videoId\": \"" + videoId + "\"}]}"
        );
        createGridElement(
            videoId,
            savedLayoutDto,
            "text1",
            "widget-textout",
            0,
            10,
            12,
            1,
            "{\"commands\": [{ \"timeSec\": 0, \"x\": 0, \"y\": 80, \"w\": 100, \"h\": 20 }]}"
        );
        createGridElement(
            videoId,
            savedLayoutDto,
            "y2",
            "app-yt-player",
            0,
            12,
            3,
            2,
            "{\"commands\": [{\"timeSec\": 0, \"x\": 0, \"y\": 0, \"h\": 50 }]}"
        );
        createGridElement(
            null,
            savedLayoutDto,
            "text2",
            "widget-textout",
            0,
            10,
            12,
            1,
            "{\"commands\": [{ \"timeSec\": 0, \"x\": 0, \"y\": 60, \"w\": 100, \"h\": 20 }]}"
        );

        return savedLayoutDto;
    }

    private Layout createLayout(User user, LayoutDTO layoutDTO) {
        Layout layout = layoutMapper.toEntity(layoutDTO);
        layout.setUser(user);
        return layoutRepository.save(layout);
    }

    private void createGridElement(
        String videoId,
        LayoutDTO savedLayoutDto,
        String channel,
        String renderer,
        int x,
        int y,
        int w,
        int h,
        String content
    ) {
        var gridElement = new GridElementDTO();
        gridElement.setLayout(savedLayoutDto);
        gridElement.setChannel(channel);
        gridElement.setRenderer(renderer);
        gridElement.setX(x);
        gridElement.setY(y);
        gridElement.setW(w);
        gridElement.setH(h);
        gridElement.setContent(content);
        gridElementService.save(gridElement);
    }

    /**
     * Update a layout.
     *
     * @param layoutDTO the entity to save.
     * @return the persisted entity.
     */
    public LayoutDTO update(LayoutDTO layoutDTO) {
        log.debug("Request to update Layout : {}", layoutDTO);
        Layout layout = layoutMapper.toEntity(layoutDTO);
        layout = layoutRepository.save(layout);
        return layoutMapper.toDto(layout);
    }

    /**
     * Partially update a layout.
     *
     * @param layoutDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<LayoutDTO> partialUpdate(LayoutDTO layoutDTO) {
        log.debug("Request to partially update Layout : {}", layoutDTO);

        return layoutRepository
            .findById(layoutDTO.getId())
            .map(existingLayout -> {
                layoutMapper.partialUpdate(existingLayout, layoutDTO);

                return existingLayout;
            })
            .map(layoutRepository::save)
            .map(layoutMapper::toDto);
    }

    /**
     * Get all the layouts with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<LayoutDTO> findAllWithEagerRelationships(Pageable pageable) {
        return layoutRepository.findAllWithEagerRelationships(pageable).map(layoutMapper::toDto);
    }

    /**
     * Get one layout by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LayoutDTO> findOne(Long id) {
        log.debug("Request to get Layout : {}", id);
        return layoutRepository.findOneWithEagerRelationships(id).map(layoutMapper::toDto);
    }

    /**
     * Delete the layout by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Layout : {}", id);
        layoutRepository.deleteById(id);
    }
}
