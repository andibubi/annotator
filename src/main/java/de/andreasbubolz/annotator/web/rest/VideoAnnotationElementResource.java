package de.andreasbubolz.annotator.web.rest;

import de.andreasbubolz.annotator.domain.VideoAnnotationElement;
import de.andreasbubolz.annotator.repository.VideoAnnotationElementRepository;
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
 * REST controller for managing {@link VideoAnnotationElement}.
 */
@RestController
@RequestMapping("/api/video-annotation-elements")
@Transactional
public class VideoAnnotationElementResource {

    private static final Logger log = LoggerFactory.getLogger(VideoAnnotationElementResource.class);

    private static final String ENTITY_NAME = "videoAnnotationElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VideoAnnotationElementRepository videoAnnotationElementRepository;

    public VideoAnnotationElementResource(VideoAnnotationElementRepository videoAnnotationElementRepository) {
        this.videoAnnotationElementRepository = videoAnnotationElementRepository;
    }

    /**
     * {@code POST  /video-annotation-elements} : Create a new videoAnnotationElement.
     *
     * @param videoAnnotationElement the videoAnnotationElement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new videoAnnotationElement, or with status {@code 400 (Bad Request)} if the videoAnnotationElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<VideoAnnotationElement> createVideoAnnotationElement(
        @Valid @RequestBody VideoAnnotationElement videoAnnotationElement
    ) throws URISyntaxException {
        log.debug("REST request to save VideoAnnotationElement : {}", videoAnnotationElement);
        if (videoAnnotationElement.getId() != null) {
            throw new BadRequestAlertException("A new videoAnnotationElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        videoAnnotationElement = videoAnnotationElementRepository.save(videoAnnotationElement);
        return ResponseEntity.created(new URI("/api/video-annotation-elements/" + videoAnnotationElement.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, videoAnnotationElement.getId().toString()))
            .body(videoAnnotationElement);
    }

    /**
     * {@code PUT  /video-annotation-elements/:id} : Updates an existing videoAnnotationElement.
     *
     * @param id the id of the videoAnnotationElement to save.
     * @param videoAnnotationElement the videoAnnotationElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated videoAnnotationElement,
     * or with status {@code 400 (Bad Request)} if the videoAnnotationElement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the videoAnnotationElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<VideoAnnotationElement> updateVideoAnnotationElement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody VideoAnnotationElement videoAnnotationElement
    ) throws URISyntaxException {
        log.debug("REST request to update VideoAnnotationElement : {}, {}", id, videoAnnotationElement);
        if (videoAnnotationElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, videoAnnotationElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!videoAnnotationElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        videoAnnotationElement = videoAnnotationElementRepository.save(videoAnnotationElement);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, videoAnnotationElement.getId().toString()))
            .body(videoAnnotationElement);
    }

    /**
     * {@code PATCH  /video-annotation-elements/:id} : Partial updates given fields of an existing videoAnnotationElement, field will ignore if it is null
     *
     * @param id the id of the videoAnnotationElement to save.
     * @param videoAnnotationElement the videoAnnotationElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated videoAnnotationElement,
     * or with status {@code 400 (Bad Request)} if the videoAnnotationElement is not valid,
     * or with status {@code 404 (Not Found)} if the videoAnnotationElement is not found,
     * or with status {@code 500 (Internal Server Error)} if the videoAnnotationElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VideoAnnotationElement> partialUpdateVideoAnnotationElement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody VideoAnnotationElement videoAnnotationElement
    ) throws URISyntaxException {
        log.debug("REST request to partial update VideoAnnotationElement partially : {}, {}", id, videoAnnotationElement);
        if (videoAnnotationElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, videoAnnotationElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!videoAnnotationElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VideoAnnotationElement> result = videoAnnotationElementRepository
            .findById(videoAnnotationElement.getId())
            .map(existingVideoAnnotationElement -> {
                if (videoAnnotationElement.getStartSec() != null) {
                    existingVideoAnnotationElement.setStartSec(videoAnnotationElement.getStartSec());
                }
                if (videoAnnotationElement.getStopSec() != null) {
                    existingVideoAnnotationElement.setStopSec(videoAnnotationElement.getStopSec());
                }
                if (videoAnnotationElement.getVideoId() != null) {
                    existingVideoAnnotationElement.setVideoId(videoAnnotationElement.getVideoId());
                }
                if (videoAnnotationElement.getVideoStartSec() != null) {
                    existingVideoAnnotationElement.setVideoStartSec(videoAnnotationElement.getVideoStartSec());
                }

                return existingVideoAnnotationElement;
            })
            .map(videoAnnotationElementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, videoAnnotationElement.getId().toString())
        );
    }

    /**
     * {@code GET  /video-annotation-elements} : get all the videoAnnotationElements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of videoAnnotationElements in body.
     */
    @GetMapping("")
    public List<VideoAnnotationElement> getAllVideoAnnotationElements() {
        log.debug("REST request to get all VideoAnnotationElements");
        return videoAnnotationElementRepository.findAll();
    }

    /**
     * {@code GET  /video-annotation-elements/:id} : get the "id" videoAnnotationElement.
     *
     * @param id the id of the videoAnnotationElement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the videoAnnotationElement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VideoAnnotationElement> getVideoAnnotationElement(@PathVariable("id") Long id) {
        log.debug("REST request to get VideoAnnotationElement : {}", id);
        Optional<VideoAnnotationElement> videoAnnotationElement = videoAnnotationElementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(videoAnnotationElement);
    }

    /**
     * {@code DELETE  /video-annotation-elements/:id} : delete the "id" videoAnnotationElement.
     *
     * @param id the id of the videoAnnotationElement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideoAnnotationElement(@PathVariable("id") Long id) {
        log.debug("REST request to delete VideoAnnotationElement : {}", id);
        videoAnnotationElementRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
