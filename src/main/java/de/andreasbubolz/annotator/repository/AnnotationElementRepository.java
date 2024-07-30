package de.andreasbubolz.annotator.repository;

import de.andreasbubolz.annotator.domain.AnnotationElement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AnnotationElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnnotationElementRepository extends JpaRepository<AnnotationElement, Long> {}
