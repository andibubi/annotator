package de.andreasbubolz.annotator.repository;

import de.andreasbubolz.annotator.domain.GridElement;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GridElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GridElementRepository extends JpaRepository<GridElement, Long>, JpaSpecificationExecutor<GridElement> {
    List<GridElement> findByLayoutId(Long layoutId);
}
