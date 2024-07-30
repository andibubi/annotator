package de.andreasbubolz.annotator.web.rest;

import de.andreasbubolz.annotator.domain.AnnotationElement;
import de.andreasbubolz.annotator.repository.AnnotationElementRepository;
import de.andreasbubolz.annotator.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link de.andreasbubolz.annotator.domain.AnnotationElement}.
 */
@RestController
@RequestMapping("/api/annotation-elements")
@Transactional
public class AnnotationElementResource {

    private static final Logger log = LoggerFactory.getLogger(AnnotationElementResource.class);

    private static final String ENTITY_NAME = "annotationElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnnotationElementRepository annotationElementRepository;

    public AnnotationElementResource(AnnotationElementRepository annotationElementRepository) {
        this.annotationElementRepository = annotationElementRepository;
    }

    /**
     * {@code POST  /annotation-elements} : Create a new annotationElement.
     *
     * @param annotationElement the annotationElement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new annotationElement, or with status {@code 400 (Bad Request)} if the annotationElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AnnotationElement> createAnnotationElement(@Valid @RequestBody AnnotationElement annotationElement)
        throws URISyntaxException {
        log.debug("REST request to save AnnotationElement : {}", annotationElement);
        if (annotationElement.getId() != null) {
            throw new BadRequestAlertException("A new annotationElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        annotationElement = annotationElementRepository.save(annotationElement);
        return ResponseEntity.created(new URI("/api/annotation-elements/" + annotationElement.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, annotationElement.getId().toString()))
            .body(annotationElement);
    }

    /**
     * {@code PUT  /annotation-elements/:id} : Updates an existing annotationElement.
     *
     * @param id the id of the annotationElement to save.
     * @param annotationElement the annotationElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated annotationElement,
     * or with status {@code 400 (Bad Request)} if the annotationElement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the annotationElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AnnotationElement> updateAnnotationElement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AnnotationElement annotationElement
    ) throws URISyntaxException {
        log.debug("REST request to update AnnotationElement : {}, {}", id, annotationElement);
        if (annotationElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, annotationElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!annotationElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        annotationElement = annotationElementRepository.save(annotationElement);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, annotationElement.getId().toString()))
            .body(annotationElement);
    }

    /**
     * {@code PATCH  /annotation-elements/:id} : Partial updates given fields of an existing annotationElement, field will ignore if it is null
     *
     * @param id the id of the annotationElement to save.
     * @param annotationElement the annotationElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated annotationElement,
     * or with status {@code 400 (Bad Request)} if the annotationElement is not valid,
     * or with status {@code 404 (Not Found)} if the annotationElement is not found,
     * or with status {@code 500 (Internal Server Error)} if the annotationElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AnnotationElement> partialUpdateAnnotationElement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AnnotationElement annotationElement
    ) throws URISyntaxException {
        log.debug("REST request to partial update AnnotationElement partially : {}, {}", id, annotationElement);
        if (annotationElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, annotationElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!annotationElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AnnotationElement> result = annotationElementRepository
            .findById(annotationElement.getId())
            .map(existingAnnotationElement -> {
                if (annotationElement.getStartSec() != null) {
                    existingAnnotationElement.setStartSec(annotationElement.getStartSec());
                }
                if (annotationElement.getText() != null) {
                    existingAnnotationElement.setText(annotationElement.getText());
                }

                return existingAnnotationElement;
            })
            .map(annotationElementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, annotationElement.getId().toString())
        );
    }

    /**
     * {@code GET  /annotation-elements} : get all the annotationElements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of annotationElements in body.
     */
    @GetMapping("")
    public List<AnnotationElement> getAllAnnotationElements() {
        log.debug("REST request to get all AnnotationElements");
        return annotationElementRepository.findAll();
    }

    /**
     * {@code GET  /annotation-elements/:id} : get the "id" annotationElement.
     *
     * @param id the id of the annotationElement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the annotationElement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AnnotationElement> getAnnotationElement(@PathVariable("id") Long id) {
        log.debug("REST request to get AnnotationElement : {}", id);
        Optional<AnnotationElement> annotationElement = annotationElementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(annotationElement);
    }

    /**
     * {@code DELETE  /annotation-elements/:id} : delete the "id" annotationElement.
     *
     * @param id the id of the annotationElement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnotationElement(@PathVariable("id") Long id) {
        log.debug("REST request to delete AnnotationElement : {}", id);
        annotationElementRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
