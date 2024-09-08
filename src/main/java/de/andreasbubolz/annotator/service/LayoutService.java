package de.andreasbubolz.annotator.service;

import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.domain.User;
import de.andreasbubolz.annotator.repository.LayoutRepository;
import de.andreasbubolz.annotator.service.dto.GridElementDTO;
import de.andreasbubolz.annotator.service.dto.LayoutDTO;
import de.andreasbubolz.annotator.service.mapper.LayoutMapper;
import java.util.Optional;
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

    private final LayoutMapper layoutMapper;

    public LayoutService(LayoutRepository layoutRepository, GridElementService gridElementService, LayoutMapper layoutMapper) {
        this.layoutRepository = layoutRepository;
        this.gridElementService = gridElementService;
        this.layoutMapper = layoutMapper;
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
        Layout layout = layoutMapper.toEntity(layoutDTO);
        layout.setUser(user);
        layout = layoutRepository.save(layout);
        var savedLayoutDto = layoutMapper.toDto(layout);

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
