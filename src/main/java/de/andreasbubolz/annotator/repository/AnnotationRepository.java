package de.andreasbubolz.annotator.repository;

import de.andreasbubolz.annotator.domain.Annotation;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Annotation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnnotationRepository extends JpaRepository<Annotation, Long> {
    @Query("select annotation from Annotation annotation where annotation.user.login = ?#{authentication.name}")
    List<Annotation> findByUserIsCurrentUser();
}
