package de.andreasbubolz.annotator.web.rest;

import de.andreasbubolz.annotator.domain.Annotation;
import de.andreasbubolz.annotator.repository.AnnotationRepository;
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
 * REST controller for managing {@link de.andreasbubolz.annotator.domain.Annotation}.
 */
@RestController
@RequestMapping("/api/annotations")
@Transactional
public class AnnotationResource {

    private static final Logger log = LoggerFactory.getLogger(AnnotationResource.class);

    private static final String ENTITY_NAME = "annotation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnnotationRepository annotationRepository;
    private final UserUtil userUtil;

    public AnnotationResource(AnnotationRepository annotationRepository, UserUtil userUtil) {
        this.annotationRepository = annotationRepository;
        this.userUtil = userUtil;
    }

    /**
     * {@code POST  /annotations} : Create a new annotation.
     *
     * @param annotation the annotation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new annotation, or with status {@code 400 (Bad Request)} if the annotation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Annotation> createAnnotation(@Valid @RequestBody Annotation annotation) throws URISyntaxException {
        log.debug("REST request to save Annotation : {}", annotation);
        var currentUser = userUtil.getCurrentUser();
        if (currentUser == null) {
            throw new BadRequestAlertException("A new annotation cannot be created anonymouslyalready have an ID", ENTITY_NAME, "idexists");
        }
        annotation.setUser(currentUser);
        if (annotation.getId() != null) {
            throw new BadRequestAlertException("A new annotation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        annotation = annotationRepository.save(annotation);
        return ResponseEntity.created(new URI("/api/annotations/" + annotation.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, annotation.getId().toString()))
            .body(annotation);
    }

    /**
     * {@code PUT  /annotations/:id} : Updates an existing annotation.
     *
     * @param id the id of the annotation to save.
     * @param annotation the annotation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated annotation,
     * or with status {@code 400 (Bad Request)} if the annotation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the annotation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Annotation> updateAnnotation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Annotation annotation
    ) throws URISyntaxException {
        log.debug("REST request to update Annotation : {}, {}", id, annotation);
        if (annotation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, annotation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!annotationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        annotation = annotationRepository.save(annotation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, annotation.getId().toString()))
            .body(annotation);
    }

    /**
     * {@code PATCH  /annotations/:id} : Partial updates given fields of an existing annotation, field will ignore if it is null
     *
     * @param id the id of the annotation to save.
     * @param annotation the annotation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated annotation,
     * or with status {@code 400 (Bad Request)} if the annotation is not valid,
     * or with status {@code 404 (Not Found)} if the annotation is not found,
     * or with status {@code 500 (Internal Server Error)} if the annotation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Annotation> partialUpdateAnnotation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Annotation annotation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Annotation partially : {}, {}", id, annotation);
        if (annotation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, annotation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!annotationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Annotation> result = annotationRepository
            .findById(annotation.getId())
            .map(existingAnnotation -> {
                if (annotation.getVideoId() != null) {
                    existingAnnotation.setVideoId(annotation.getVideoId());
                }

                return existingAnnotation;
            })
            .map(annotationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, annotation.getId().toString())
        );
    }

    /**
     * {@code GET  /annotations} : get all the annotations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of annotations in body.
     */
    @GetMapping("")
    public List<Annotation> getAllAnnotations() {
        log.debug("REST request to get all Annotations");
        return annotationRepository.findAll();
    }

    /**
     * {@code GET  /annotations/:id} : get the "id" annotation.
     *
     * @param id the id of the annotation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the annotation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Annotation> getAnnotation(@PathVariable("id") Long id) {
        log.debug("REST request to get Annotation : {}", id);
        Optional<Annotation> annotation = annotationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(annotation);
    }

    /**
     * {@code DELETE  /annotations/:id} : delete the "id" annotation.
     *
     * @param id the id of the annotation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnotation(@PathVariable("id") Long id) {
        log.debug("REST request to delete Annotation : {}", id);
        annotationRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
