package de.andreasbubolz.annotator.repository;

import de.andreasbubolz.annotator.domain.VideoAnnotationElement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VideoAnnotationElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VideoAnnotationElementRepository extends JpaRepository<VideoAnnotationElement, Long> {
    List<VideoAnnotationElement> findAllByAnnotationId(Long annotationId);
}
