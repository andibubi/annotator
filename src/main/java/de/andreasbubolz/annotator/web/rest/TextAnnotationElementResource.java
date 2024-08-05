package de.andreasbubolz.annotator.web.rest;

import de.andreasbubolz.annotator.domain.TextAnnotationElement;
import de.andreasbubolz.annotator.repository.TextAnnotationElementRepository;
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
 * REST controller for managing {@link de.andreasbubolz.annotator.domain.TextAnnotationElement}.
 */
@RestController
@RequestMapping("/api/text-annotation-elements")
@Transactional
public class TextAnnotationElementResource {

    private static final Logger log = LoggerFactory.getLogger(TextAnnotationElementResource.class);

    private static final String ENTITY_NAME = "textAnnotationElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TextAnnotationElementRepository textAnnotationElementRepository;

    public TextAnnotationElementResource(TextAnnotationElementRepository textAnnotationElementRepository) {
        this.textAnnotationElementRepository = textAnnotationElementRepository;
    }

    /**
     * {@code POST  /text-annotation-elements} : Create a new textAnnotationElement.
     *
     * @param textAnnotationElement the textAnnotationElement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new textAnnotationElement, or with status {@code 400 (Bad Request)} if the textAnnotationElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TextAnnotationElement> createTextAnnotationElement(
        @Valid @RequestBody TextAnnotationElement textAnnotationElement
    ) throws URISyntaxException {
        log.debug("REST request to save TextAnnotationElement : {}", textAnnotationElement);
        if (textAnnotationElement.getId() != null) {
            throw new BadRequestAlertException("A new textAnnotationElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        textAnnotationElement = textAnnotationElementRepository.save(textAnnotationElement);
        return ResponseEntity.created(new URI("/api/text-annotation-elements/" + textAnnotationElement.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, textAnnotationElement.getId().toString()))
            .body(textAnnotationElement);
    }

    /**
     * {@code PUT  /text-annotation-elements/:id} : Updates an existing textAnnotationElement.
     *
     * @param id the id of the textAnnotationElement to save.
     * @param textAnnotationElement the textAnnotationElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated textAnnotationElement,
     * or with status {@code 400 (Bad Request)} if the textAnnotationElement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the textAnnotationElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TextAnnotationElement> updateTextAnnotationElement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TextAnnotationElement textAnnotationElement
    ) throws URISyntaxException {
        log.debug("REST request to update TextAnnotationElement : {}, {}", id, textAnnotationElement);
        if (textAnnotationElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, textAnnotationElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!textAnnotationElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        textAnnotationElement = textAnnotationElementRepository.save(textAnnotationElement);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, textAnnotationElement.getId().toString()))
            .body(textAnnotationElement);
    }

    /**
     * {@code PATCH  /text-annotation-elements/:id} : Partial updates given fields of an existing textAnnotationElement, field will ignore if it is null
     *
     * @param id the id of the textAnnotationElement to save.
     * @param textAnnotationElement the textAnnotationElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated textAnnotationElement,
     * or with status {@code 400 (Bad Request)} if the textAnnotationElement is not valid,
     * or with status {@code 404 (Not Found)} if the textAnnotationElement is not found,
     * or with status {@code 500 (Internal Server Error)} if the textAnnotationElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TextAnnotationElement> partialUpdateTextAnnotationElement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TextAnnotationElement textAnnotationElement
    ) throws URISyntaxException {
        log.debug("REST request to partial update TextAnnotationElement partially : {}, {}", id, textAnnotationElement);
        if (textAnnotationElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, textAnnotationElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!textAnnotationElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TextAnnotationElement> result = textAnnotationElementRepository
            .findById(textAnnotationElement.getId())
            .map(existingTextAnnotationElement -> {
                if (textAnnotationElement.getStartSec() != null) {
                    existingTextAnnotationElement.setStartSec(textAnnotationElement.getStartSec());
                }
                if (textAnnotationElement.getText() != null) {
                    existingTextAnnotationElement.setText(textAnnotationElement.getText());
                }

                return existingTextAnnotationElement;
            })
            .map(textAnnotationElementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, textAnnotationElement.getId().toString())
        );
    }

    /**
     * {@code GET  /text-annotation-elements} : get all the textAnnotationElements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of textAnnotationElements in body.
     */
    @GetMapping("")
    public List<TextAnnotationElement> getAllTextAnnotationElements() {
        log.debug("REST request to get all TextAnnotationElements");
        return textAnnotationElementRepository.findAll();
    }

    /**
     * {@code GET  /text-annotation-elements/:id} : get the "id" textAnnotationElement.
     *
     * @param id the id of the textAnnotationElement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the textAnnotationElement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TextAnnotationElement> getTextAnnotationElement(@PathVariable("id") Long id) {
        log.debug("REST request to get TextAnnotationElement : {}", id);
        Optional<TextAnnotationElement> textAnnotationElement = textAnnotationElementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(textAnnotationElement);
    }

    /**
     * {@code DELETE  /text-annotation-elements/:id} : delete the "id" textAnnotationElement.
     *
     * @param id the id of the textAnnotationElement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTextAnnotationElement(@PathVariable("id") Long id) {
        log.debug("REST request to delete TextAnnotationElement : {}", id);
        textAnnotationElementRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
