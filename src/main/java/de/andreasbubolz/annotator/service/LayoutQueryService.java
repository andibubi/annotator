package de.andreasbubolz.annotator.service;

import de.andreasbubolz.annotator.domain.*; // for static metamodels
import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.repository.LayoutRepository;
import de.andreasbubolz.annotator.service.criteria.LayoutCriteria;
import de.andreasbubolz.annotator.service.dto.LayoutDTO;
import de.andreasbubolz.annotator.service.mapper.LayoutMapper;
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
 * Service for executing complex queries for {@link Layout} entities in the database.
 * The main input is a {@link LayoutCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link LayoutDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class LayoutQueryService extends QueryService<Layout> {

    private static final Logger log = LoggerFactory.getLogger(LayoutQueryService.class);

    private final LayoutRepository layoutRepository;

    private final LayoutMapper layoutMapper;

    public LayoutQueryService(LayoutRepository layoutRepository, LayoutMapper layoutMapper) {
        this.layoutRepository = layoutRepository;
        this.layoutMapper = layoutMapper;
    }

    /**
     * Return a {@link Page} of {@link LayoutDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<LayoutDTO> findByCriteria(LayoutCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Layout> specification = createSpecification(criteria);
        return layoutRepository.findAll(specification, page).map(layoutMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(LayoutCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Layout> specification = createSpecification(criteria);
        return layoutRepository.count(specification);
    }

    /**
     * Function to convert {@link LayoutCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Layout> createSpecification(LayoutCriteria criteria) {
        Specification<Layout> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Layout_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Layout_.name));
            }
            if (criteria.getCreated_at() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreated_at(), Layout_.created_at));
            }
            if (criteria.getUpdated_at() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdated_at(), Layout_.updated_at));
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getUserId(), root -> root.join(Layout_.user, JoinType.LEFT).get(User_.id))
                );
            }
        }
        return specification;
    }
}
