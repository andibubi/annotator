package de.andreasbubolz.annotator.service;

import de.andreasbubolz.annotator.domain.*; // for static metamodels
import de.andreasbubolz.annotator.domain.GridElement;
import de.andreasbubolz.annotator.repository.GridElementRepository;
import de.andreasbubolz.annotator.service.criteria.GridElementCriteria;
import de.andreasbubolz.annotator.service.dto.GridElementDTO;
import de.andreasbubolz.annotator.service.mapper.GridElementMapper;
import jakarta.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link GridElement} entities in the database.
 * The main input is a {@link GridElementCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link GridElementDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class GridElementQueryService extends QueryService<GridElement> {

    private static final Logger log = LoggerFactory.getLogger(GridElementQueryService.class);

    private final GridElementRepository gridElementRepository;

    private final GridElementMapper gridElementMapper;

    public GridElementQueryService(GridElementRepository gridElementRepository, GridElementMapper gridElementMapper) {
        this.gridElementRepository = gridElementRepository;
        this.gridElementMapper = gridElementMapper;
    }

    /**
     * Return a {@link Page} of {@link GridElementDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<GridElementDTO> findByCriteria(GridElementCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<GridElement> specification = createSpecification(criteria);
        return gridElementRepository.findAll(specification, page).map(gridElementMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(GridElementCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<GridElement> specification = createSpecification(criteria);
        return gridElementRepository.count(specification);
    }

    /**
     * Function to convert {@link GridElementCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<GridElement> createSpecification(GridElementCriteria criteria) {
        Specification<GridElement> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), GridElement_.id));
            }
            if (criteria.getX() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getX(), GridElement_.x));
            }
            if (criteria.getY() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getY(), GridElement_.y));
            }
            if (criteria.getW() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getW(), GridElement_.w));
            }
            if (criteria.getH() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getH(), GridElement_.h));
            }
            if (criteria.getChannel() != null) {
                specification = specification.and(buildStringSpecification(criteria.getChannel(), GridElement_.channel));
            }
            if (criteria.getRenderer() != null) {
                specification = specification.and(buildStringSpecification(criteria.getRenderer(), GridElement_.renderer));
            }
            if (criteria.getContent() != null) {
                specification = specification.and(buildStringSpecification(criteria.getContent(), GridElement_.content));
            }
            if (criteria.getDisplayAfterMillis() != null) {
                specification = specification.and(
                    buildRangeSpecification(criteria.getDisplayAfterMillis(), GridElement_.displayAfterMillis)
                );
            }
            if (criteria.getDisplayDurationMillis() != null) {
                specification = specification.and(
                    buildRangeSpecification(criteria.getDisplayDurationMillis(), GridElement_.displayDurationMillis)
                );
            }
            if (criteria.getLayoutId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getLayoutId(), root -> root.join(GridElement_.layout, JoinType.LEFT).get(Layout_.id))
                );
            }
            if (criteria.getGridElementId() != null) {
                specification = specification.and(
                    buildSpecification(
                        criteria.getGridElementId(),
                        root -> root.join(GridElement_.gridElement, JoinType.LEFT).get(GridElement_.id)
                    )
                );
            }
            if (criteria.getGridElementsId() != null) {
                specification = specification.and(
                    buildSpecification(
                        criteria.getGridElementsId(),
                        root -> root.join(GridElement_.gridElements, JoinType.LEFT).get(GridElement_.id)
                    )
                );
            }
        }
        return specification;
    }
}
