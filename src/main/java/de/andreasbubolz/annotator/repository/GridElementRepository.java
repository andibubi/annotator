package de.andreasbubolz.annotator.repository;

import de.andreasbubolz.annotator.domain.GridElement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GridElementRepository extends JpaRepository<GridElement, Long> {}
