package de.andreasbubolz.annotator.service;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link de.andreasbubolz.annotator.domain.Layout}.
 */
@Service
@Transactional
public class LayoutService {

    private static final Logger log = LoggerFactory.getLogger(LayoutService.class);

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

    public GridElementDTO createOrUpdateGridElement(GridElementDTO gridElementDto) {
        // TODO gridElements und layout sollten per JPA mit einem Methodenaufruf gesichert werden können
        var currentUser = userUtil.getCurrentUser();
        var layout = layoutRepository.findById(gridElementDto.getLayout().getId()).get();
        if (!layout.getUser().getId().equals(currentUser.getId())) {
            var orgGridElements = gridElementRepository.findByLayoutId(layout.getId());

            var newLayout = new Layout().user(currentUser);
            var orgGridElement = orgGridElements.stream().filter(g -> g.getId().equals(gridElementDto.getId())).findFirst().get();
            var result = new HashSet<GridElement>();
            for (var gridElement : orgGridElements) {
                // TODO Sollte per JPA schöner gehen (s.o.)
                entityManager.detach(gridElement);
                gridElement.setLayout(newLayout);
                if (gridElement.equals(orgGridElement)) {
                    gridElement.setContent(gridElementDto.getContent());
                }
                gridElement.setId(null);
                result.add(gridElement);
            }
            newLayout.setGridElements(result);
            newLayout = layoutRepository.save(newLayout);

            for (var recylcledGridElement : result) gridElementRepository.save(recylcledGridElement);

            // TODO geänderte id ist dirty Kennzeichen für Layout-Wechsel
            gridElementDto.setLayout(layoutMapper.toDto(newLayout));

            return gridElementDto;
        } else {
            return gridElementService.save(gridElementDto);
        }
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
            "org",
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
            "cmt",
            "widget-textout",
            0,
            11,
            12,
            1,
            "{\"commands\": [{ \"timeSec\": 0, \"x\": 0, \"y\": 80, \"w\": 100, \"h\": 20 }]}"
        );
        createGridElement(
            videoId,
            savedLayoutDto,
            "sec",
            "app-yt-player",
            0,
            12,
            3,
            2,
            "{\"commands\": [{\"timeSec\": 0, \"x\": 0, \"y\": 0, \"h\": 50 }]}"
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
