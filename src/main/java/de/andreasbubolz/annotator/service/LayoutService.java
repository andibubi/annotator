package de.andreasbubolz.annotator.service;

import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.repository.LayoutRepository;
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

    private final LayoutMapper layoutMapper;

    public LayoutService(LayoutRepository layoutRepository, LayoutMapper layoutMapper) {
        this.layoutRepository = layoutRepository;
        this.layoutMapper = layoutMapper;
    }

    /**
     * Save a layout.
     *
     * @param layoutDTO the entity to save.
     * @return the persisted entity.
     */
    public LayoutDTO save(LayoutDTO layoutDTO) {
        log.debug("Request to save Layout : {}", layoutDTO);
        Layout layout = layoutMapper.toEntity(layoutDTO);
        layout = layoutRepository.save(layout);
        return layoutMapper.toDto(layout);
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
