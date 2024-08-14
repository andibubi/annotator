package de.andreasbubolz.annotator.service;

import de.andreasbubolz.annotator.domain.GridElement;
import de.andreasbubolz.annotator.repository.GridElementRepository;
import de.andreasbubolz.annotator.service.dto.GridElementDTO;
import de.andreasbubolz.annotator.service.mapper.GridElementMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link de.andreasbubolz.annotator.domain.GridElement}.
 */
@Service
@Transactional
public class GridElementService {

    private static final Logger log = LoggerFactory.getLogger(GridElementService.class);

    private final GridElementRepository gridElementRepository;

    private final GridElementMapper gridElementMapper;

    public GridElementService(GridElementRepository gridElementRepository, GridElementMapper gridElementMapper) {
        this.gridElementRepository = gridElementRepository;
        this.gridElementMapper = gridElementMapper;
    }

    /**
     * Save a gridElement.
     *
     * @param gridElementDTO the entity to save.
     * @return the persisted entity.
     */
    public GridElementDTO save(GridElementDTO gridElementDTO) {
        log.debug("Request to save GridElement : {}", gridElementDTO);
        GridElement gridElement = gridElementMapper.toEntity(gridElementDTO);
        gridElement = gridElementRepository.save(gridElement);
        return gridElementMapper.toDto(gridElement);
    }

    /**
     * Update a gridElement.
     *
     * @param gridElementDTO the entity to save.
     * @return the persisted entity.
     */
    public GridElementDTO update(GridElementDTO gridElementDTO) {
        log.debug("Request to update GridElement : {}", gridElementDTO);
        GridElement gridElement = gridElementMapper.toEntity(gridElementDTO);
        gridElement = gridElementRepository.save(gridElement);
        return gridElementMapper.toDto(gridElement);
    }

    /**
     * Partially update a gridElement.
     *
     * @param gridElementDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<GridElementDTO> partialUpdate(GridElementDTO gridElementDTO) {
        log.debug("Request to partially update GridElement : {}", gridElementDTO);

        return gridElementRepository
            .findById(gridElementDTO.getId())
            .map(existingGridElement -> {
                gridElementMapper.partialUpdate(existingGridElement, gridElementDTO);

                return existingGridElement;
            })
            .map(gridElementRepository::save)
            .map(gridElementMapper::toDto);
    }

    /**
     * Get one gridElement by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<GridElementDTO> findOne(Long id) {
        log.debug("Request to get GridElement : {}", id);
        return gridElementRepository.findById(id).map(gridElementMapper::toDto);
    }

    /**
     * Delete the gridElement by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete GridElement : {}", id);
        gridElementRepository.deleteById(id);
    }
}
