package de.andreasbubolz.annotator.web.rest;

import de.andreasbubolz.annotator.service.LayoutQueryService;
import de.andreasbubolz.annotator.service.LayoutService;
import de.andreasbubolz.annotator.service.criteria.LayoutCriteria;
import de.andreasbubolz.annotator.service.dto.LayoutDTO;
import de.andreasbubolz.annotator.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
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
 * REST controller for managing {@link de.andreasbubolz.annotator.domain.Layout}.
 */
@RestController
@RequestMapping("/api/layouts")
public class LayoutResource {

    private static final Logger log = LoggerFactory.getLogger(LayoutResource.class);

    private static final String ENTITY_NAME = "layout";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LayoutService layoutService;

    private final LayoutQueryService layoutQueryService;
    private final UserUtil userUtil;

    public LayoutResource(LayoutService layoutService, LayoutQueryService layoutQueryService, UserUtil userUtil) {
        this.layoutService = layoutService;
        this.layoutQueryService = layoutQueryService;
        this.userUtil = userUtil;
    }

    /**
     * {@code GET  /layouts} : get all the layouts.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of layouts in body.
     */
    @GetMapping("")
    public ResponseEntity<List<LayoutDTO>> getAllLayouts(
        LayoutCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get Layouts by criteria: {}", criteria);

        Page<LayoutDTO> page = layoutQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /layouts/count} : count all the layouts.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countLayouts(LayoutCriteria criteria) {
        log.debug("REST request to count Layouts by criteria: {}", criteria);
        return ResponseEntity.ok().body(layoutQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /layouts/:id} : get the "id" layout.
     *
     * @param id the id of the layoutDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the layoutDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LayoutDTO> getLayout(@PathVariable("id") Long id) {
        log.debug("REST request to get Layout : {}", id);
        Optional<LayoutDTO> layoutDTO = layoutService.findOne(id);
        return ResponseUtil.wrapOrNotFound(layoutDTO);
    }

    @PostMapping("")
    public ResponseEntity<LayoutDTO> createLayout(
        @RequestParam(value = "videoId", required = false) String videoId,
        @Valid @RequestBody LayoutDTO layout
    ) throws URISyntaxException {
        var currentUser = userUtil.getCurrentUser();
        if (currentUser == null) {
            throw new BadRequestAlertException("A new layout cannot be created anonymouslyalready have an ID", ENTITY_NAME, "idexists");
        }
        if (layout.getId() != null) {
            throw new BadRequestAlertException("A new layout cannot already have an ID", ENTITY_NAME, "idexists");
        }
        layout = layoutService.createLayoutWithSomeGridItems(currentUser, layout, videoId);

        return ResponseEntity.created(new URI("/api/layouts/" + layout.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, layout.getId().toString()))
            .body(layout);
    }
}
