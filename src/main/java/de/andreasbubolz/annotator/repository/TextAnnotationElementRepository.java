package de.andreasbubolz.annotator.repository;

import de.andreasbubolz.annotator.domain.TextAnnotationElement;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TextAnnotationElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TextAnnotationElementRepository extends JpaRepository<TextAnnotationElement, Long> {
    List<TextAnnotationElement> findAllByAnnotationId(Long annotationId);
}
