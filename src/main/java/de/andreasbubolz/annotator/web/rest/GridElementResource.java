package de.andreasbubolz.annotator.web.rest;

import de.andreasbubolz.annotator.repository.GridElementRepository;
import de.andreasbubolz.annotator.service.GridElementQueryService;
import de.andreasbubolz.annotator.service.GridElementService;
import de.andreasbubolz.annotator.service.criteria.GridElementCriteria;
import de.andreasbubolz.annotator.service.dto.GridElementDTO;
import de.andreasbubolz.annotator.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link de.andreasbubolz.annotator.domain.GridElement}.
 */
@RestController
@RequestMapping("/api/grid-elements")
public class GridElementResource {

    private static final Logger log = LoggerFactory.getLogger(GridElementResource.class);

    private static final String ENTITY_NAME = "gridElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GridElementService gridElementService;

    private final GridElementRepository gridElementRepository;

    private final GridElementQueryService gridElementQueryService;

    public GridElementResource(
        GridElementService gridElementService,
        GridElementRepository gridElementRepository,
        GridElementQueryService gridElementQueryService
    ) {
        this.gridElementService = gridElementService;
        this.gridElementRepository = gridElementRepository;
        this.gridElementQueryService = gridElementQueryService;
    }

    /**
     * {@code POST  /grid-elements} : Create a new gridElement.
     *
     * @param gridElementDTO the gridElementDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gridElementDTO, or with status {@code 400 (Bad Request)} if the gridElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<GridElementDTO> createGridElement(@RequestBody GridElementDTO gridElementDTO) throws URISyntaxException {
        log.debug("REST request to save GridElement : {}", gridElementDTO);
        if (gridElementDTO.getId() != null) {
            throw new BadRequestAlertException("A new gridElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        gridElementDTO = gridElementService.save(gridElementDTO);
        return ResponseEntity.created(new URI("/api/grid-elements/" + gridElementDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, gridElementDTO.getId().toString()))
            .body(gridElementDTO);
    }

    /**
     * {@code PUT  /grid-elements/:id} : Updates an existing gridElement.
     *
     * @param id the id of the gridElementDTO to save.
     * @param gridElementDTO the gridElementDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gridElementDTO,
     * or with status {@code 400 (Bad Request)} if the gridElementDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gridElementDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<GridElementDTO> updateGridElement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GridElementDTO gridElementDTO
    ) throws URISyntaxException {
        log.debug("REST request to update GridElement : {}, {}", id, gridElementDTO);
        if (gridElementDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gridElementDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gridElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        gridElementDTO = gridElementService.update(gridElementDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, gridElementDTO.getId().toString()))
            .body(gridElementDTO);
    }

    /**
     * {@code PATCH  /grid-elements/:id} : Partial updates given fields of an existing gridElement, field will ignore if it is null
     *
     * @param id the id of the gridElementDTO to save.
     * @param gridElementDTO the gridElementDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gridElementDTO,
     * or with status {@code 400 (Bad Request)} if the gridElementDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gridElementDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gridElementDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GridElementDTO> partialUpdateGridElement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GridElementDTO gridElementDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update GridElement partially : {}, {}", id, gridElementDTO);
        if (gridElementDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gridElementDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gridElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GridElementDTO> result = gridElementService.partialUpdate(gridElementDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, gridElementDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /grid-elements} : get all the gridElements.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gridElements in body.
     */
    @GetMapping("")
    public ResponseEntity<List<GridElementDTO>> getAllGridElements(
        GridElementCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get GridElements by criteria: {}", criteria);

        Page<GridElementDTO> page = gridElementQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /grid-elements/count} : count all the gridElements.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countGridElements(GridElementCriteria criteria) {
        log.debug("REST request to count GridElements by criteria: {}", criteria);
        return ResponseEntity.ok().body(gridElementQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /grid-elements/:id} : get the "id" gridElement.
     *
     * @param id the id of the gridElementDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gridElementDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GridElementDTO> getGridElement(@PathVariable("id") Long id) {
        log.debug("REST request to get GridElement : {}", id);
        Optional<GridElementDTO> gridElementDTO = gridElementService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gridElementDTO);
    }

    /**
     * {@code DELETE  /grid-elements/:id} : delete the "id" gridElement.
     *
     * @param id the id of the gridElementDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGridElement(@PathVariable("id") Long id) {
        log.debug("REST request to delete GridElement : {}", id);
        gridElementService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
