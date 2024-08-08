package de.andreasbubolz.annotator.web.rest;

import static de.andreasbubolz.annotator.domain.GridElementAsserts.*;
import static de.andreasbubolz.annotator.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.andreasbubolz.annotator.IntegrationTest;
import de.andreasbubolz.annotator.domain.GridElement;
import de.andreasbubolz.annotator.domain.GridElement;
import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.repository.GridElementRepository;
import de.andreasbubolz.annotator.service.dto.GridElementDTO;
import de.andreasbubolz.annotator.service.mapper.GridElementMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GridElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GridElementResourceIT {

    private static final Integer DEFAULT_X = 1;
    private static final Integer UPDATED_X = 2;
    private static final Integer SMALLER_X = 1 - 1;

    private static final Integer DEFAULT_Y = 1;
    private static final Integer UPDATED_Y = 2;
    private static final Integer SMALLER_Y = 1 - 1;

    private static final Integer DEFAULT_W = 1;
    private static final Integer UPDATED_W = 2;
    private static final Integer SMALLER_W = 1 - 1;

    private static final Integer DEFAULT_H = 1;
    private static final Integer UPDATED_H = 2;
    private static final Integer SMALLER_H = 1 - 1;

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Long DEFAULT_DISPLAY_AFTER_MILLIS = 1L;
    private static final Long UPDATED_DISPLAY_AFTER_MILLIS = 2L;
    private static final Long SMALLER_DISPLAY_AFTER_MILLIS = 1L - 1L;

    private static final Long DEFAULT_DISPLAY_DURATION_MILLIS = 1L;
    private static final Long UPDATED_DISPLAY_DURATION_MILLIS = 2L;
    private static final Long SMALLER_DISPLAY_DURATION_MILLIS = 1L - 1L;

    private static final String ENTITY_API_URL = "/api/grid-elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GridElementRepository gridElementRepository;

    @Autowired
    private GridElementMapper gridElementMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGridElementMockMvc;

    private GridElement gridElement;

    private GridElement insertedGridElement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GridElement createEntity(EntityManager em) {
        GridElement gridElement = new GridElement()
            .x(DEFAULT_X)
            .y(DEFAULT_Y)
            .w(DEFAULT_W)
            .h(DEFAULT_H)
            .content(DEFAULT_CONTENT)
            .displayAfterMillis(DEFAULT_DISPLAY_AFTER_MILLIS)
            .displayDurationMillis(DEFAULT_DISPLAY_DURATION_MILLIS);
        return gridElement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GridElement createUpdatedEntity(EntityManager em) {
        GridElement gridElement = new GridElement()
            .x(UPDATED_X)
            .y(UPDATED_Y)
            .w(UPDATED_W)
            .h(UPDATED_H)
            .content(UPDATED_CONTENT)
            .displayAfterMillis(UPDATED_DISPLAY_AFTER_MILLIS)
            .displayDurationMillis(UPDATED_DISPLAY_DURATION_MILLIS);
        return gridElement;
    }

    @BeforeEach
    public void initTest() {
        gridElement = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedGridElement != null) {
            gridElementRepository.delete(insertedGridElement);
            insertedGridElement = null;
        }
    }

    @Test
    @Transactional
    void createGridElement() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the GridElement
        GridElementDTO gridElementDTO = gridElementMapper.toDto(gridElement);
        var returnedGridElementDTO = om.readValue(
            restGridElementMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gridElementDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            GridElementDTO.class
        );

        // Validate the GridElement in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedGridElement = gridElementMapper.toEntity(returnedGridElementDTO);
        assertGridElementUpdatableFieldsEquals(returnedGridElement, getPersistedGridElement(returnedGridElement));

        insertedGridElement = returnedGridElement;
    }

    @Test
    @Transactional
    void createGridElementWithExistingId() throws Exception {
        // Create the GridElement with an existing ID
        gridElement.setId(1L);
        GridElementDTO gridElementDTO = gridElementMapper.toDto(gridElement);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGridElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gridElementDTO)))
            .andExpect(status().isBadRequest());

        // Validate the GridElement in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGridElements() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList
        restGridElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gridElement.getId().intValue())))
            .andExpect(jsonPath("$.[*].x").value(hasItem(DEFAULT_X)))
            .andExpect(jsonPath("$.[*].y").value(hasItem(DEFAULT_Y)))
            .andExpect(jsonPath("$.[*].w").value(hasItem(DEFAULT_W)))
            .andExpect(jsonPath("$.[*].h").value(hasItem(DEFAULT_H)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].displayAfterMillis").value(hasItem(DEFAULT_DISPLAY_AFTER_MILLIS.intValue())))
            .andExpect(jsonPath("$.[*].displayDurationMillis").value(hasItem(DEFAULT_DISPLAY_DURATION_MILLIS.intValue())));
    }

    @Test
    @Transactional
    void getGridElement() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get the gridElement
        restGridElementMockMvc
            .perform(get(ENTITY_API_URL_ID, gridElement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gridElement.getId().intValue()))
            .andExpect(jsonPath("$.x").value(DEFAULT_X))
            .andExpect(jsonPath("$.y").value(DEFAULT_Y))
            .andExpect(jsonPath("$.w").value(DEFAULT_W))
            .andExpect(jsonPath("$.h").value(DEFAULT_H))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.displayAfterMillis").value(DEFAULT_DISPLAY_AFTER_MILLIS.intValue()))
            .andExpect(jsonPath("$.displayDurationMillis").value(DEFAULT_DISPLAY_DURATION_MILLIS.intValue()));
    }

    @Test
    @Transactional
    void getGridElementsByIdFiltering() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        Long id = gridElement.getId();

        defaultGridElementFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultGridElementFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultGridElementFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllGridElementsByXIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where x equals to
        defaultGridElementFiltering("x.equals=" + DEFAULT_X, "x.equals=" + UPDATED_X);
    }

    @Test
    @Transactional
    void getAllGridElementsByXIsInShouldWork() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where x in
        defaultGridElementFiltering("x.in=" + DEFAULT_X + "," + UPDATED_X, "x.in=" + UPDATED_X);
    }

    @Test
    @Transactional
    void getAllGridElementsByXIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where x is not null
        defaultGridElementFiltering("x.specified=true", "x.specified=false");
    }

    @Test
    @Transactional
    void getAllGridElementsByXIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where x is greater than or equal to
        defaultGridElementFiltering("x.greaterThanOrEqual=" + DEFAULT_X, "x.greaterThanOrEqual=" + UPDATED_X);
    }

    @Test
    @Transactional
    void getAllGridElementsByXIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where x is less than or equal to
        defaultGridElementFiltering("x.lessThanOrEqual=" + DEFAULT_X, "x.lessThanOrEqual=" + SMALLER_X);
    }

    @Test
    @Transactional
    void getAllGridElementsByXIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where x is less than
        defaultGridElementFiltering("x.lessThan=" + UPDATED_X, "x.lessThan=" + DEFAULT_X);
    }

    @Test
    @Transactional
    void getAllGridElementsByXIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where x is greater than
        defaultGridElementFiltering("x.greaterThan=" + SMALLER_X, "x.greaterThan=" + DEFAULT_X);
    }

    @Test
    @Transactional
    void getAllGridElementsByYIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where y equals to
        defaultGridElementFiltering("y.equals=" + DEFAULT_Y, "y.equals=" + UPDATED_Y);
    }

    @Test
    @Transactional
    void getAllGridElementsByYIsInShouldWork() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where y in
        defaultGridElementFiltering("y.in=" + DEFAULT_Y + "," + UPDATED_Y, "y.in=" + UPDATED_Y);
    }

    @Test
    @Transactional
    void getAllGridElementsByYIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where y is not null
        defaultGridElementFiltering("y.specified=true", "y.specified=false");
    }

    @Test
    @Transactional
    void getAllGridElementsByYIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where y is greater than or equal to
        defaultGridElementFiltering("y.greaterThanOrEqual=" + DEFAULT_Y, "y.greaterThanOrEqual=" + UPDATED_Y);
    }

    @Test
    @Transactional
    void getAllGridElementsByYIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where y is less than or equal to
        defaultGridElementFiltering("y.lessThanOrEqual=" + DEFAULT_Y, "y.lessThanOrEqual=" + SMALLER_Y);
    }

    @Test
    @Transactional
    void getAllGridElementsByYIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where y is less than
        defaultGridElementFiltering("y.lessThan=" + UPDATED_Y, "y.lessThan=" + DEFAULT_Y);
    }

    @Test
    @Transactional
    void getAllGridElementsByYIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where y is greater than
        defaultGridElementFiltering("y.greaterThan=" + SMALLER_Y, "y.greaterThan=" + DEFAULT_Y);
    }

    @Test
    @Transactional
    void getAllGridElementsByWIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where w equals to
        defaultGridElementFiltering("w.equals=" + DEFAULT_W, "w.equals=" + UPDATED_W);
    }

    @Test
    @Transactional
    void getAllGridElementsByWIsInShouldWork() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where w in
        defaultGridElementFiltering("w.in=" + DEFAULT_W + "," + UPDATED_W, "w.in=" + UPDATED_W);
    }

    @Test
    @Transactional
    void getAllGridElementsByWIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where w is not null
        defaultGridElementFiltering("w.specified=true", "w.specified=false");
    }

    @Test
    @Transactional
    void getAllGridElementsByWIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where w is greater than or equal to
        defaultGridElementFiltering("w.greaterThanOrEqual=" + DEFAULT_W, "w.greaterThanOrEqual=" + UPDATED_W);
    }

    @Test
    @Transactional
    void getAllGridElementsByWIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where w is less than or equal to
        defaultGridElementFiltering("w.lessThanOrEqual=" + DEFAULT_W, "w.lessThanOrEqual=" + SMALLER_W);
    }

    @Test
    @Transactional
    void getAllGridElementsByWIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where w is less than
        defaultGridElementFiltering("w.lessThan=" + UPDATED_W, "w.lessThan=" + DEFAULT_W);
    }

    @Test
    @Transactional
    void getAllGridElementsByWIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where w is greater than
        defaultGridElementFiltering("w.greaterThan=" + SMALLER_W, "w.greaterThan=" + DEFAULT_W);
    }

    @Test
    @Transactional
    void getAllGridElementsByHIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where h equals to
        defaultGridElementFiltering("h.equals=" + DEFAULT_H, "h.equals=" + UPDATED_H);
    }

    @Test
    @Transactional
    void getAllGridElementsByHIsInShouldWork() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where h in
        defaultGridElementFiltering("h.in=" + DEFAULT_H + "," + UPDATED_H, "h.in=" + UPDATED_H);
    }

    @Test
    @Transactional
    void getAllGridElementsByHIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where h is not null
        defaultGridElementFiltering("h.specified=true", "h.specified=false");
    }

    @Test
    @Transactional
    void getAllGridElementsByHIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where h is greater than or equal to
        defaultGridElementFiltering("h.greaterThanOrEqual=" + DEFAULT_H, "h.greaterThanOrEqual=" + UPDATED_H);
    }

    @Test
    @Transactional
    void getAllGridElementsByHIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where h is less than or equal to
        defaultGridElementFiltering("h.lessThanOrEqual=" + DEFAULT_H, "h.lessThanOrEqual=" + SMALLER_H);
    }

    @Test
    @Transactional
    void getAllGridElementsByHIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where h is less than
        defaultGridElementFiltering("h.lessThan=" + UPDATED_H, "h.lessThan=" + DEFAULT_H);
    }

    @Test
    @Transactional
    void getAllGridElementsByHIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where h is greater than
        defaultGridElementFiltering("h.greaterThan=" + SMALLER_H, "h.greaterThan=" + DEFAULT_H);
    }

    @Test
    @Transactional
    void getAllGridElementsByContentIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where content equals to
        defaultGridElementFiltering("content.equals=" + DEFAULT_CONTENT, "content.equals=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllGridElementsByContentIsInShouldWork() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where content in
        defaultGridElementFiltering("content.in=" + DEFAULT_CONTENT + "," + UPDATED_CONTENT, "content.in=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllGridElementsByContentIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where content is not null
        defaultGridElementFiltering("content.specified=true", "content.specified=false");
    }

    @Test
    @Transactional
    void getAllGridElementsByContentContainsSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where content contains
        defaultGridElementFiltering("content.contains=" + DEFAULT_CONTENT, "content.contains=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllGridElementsByContentNotContainsSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where content does not contain
        defaultGridElementFiltering("content.doesNotContain=" + UPDATED_CONTENT, "content.doesNotContain=" + DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayAfterMillisIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayAfterMillis equals to
        defaultGridElementFiltering(
            "displayAfterMillis.equals=" + DEFAULT_DISPLAY_AFTER_MILLIS,
            "displayAfterMillis.equals=" + UPDATED_DISPLAY_AFTER_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayAfterMillisIsInShouldWork() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayAfterMillis in
        defaultGridElementFiltering(
            "displayAfterMillis.in=" + DEFAULT_DISPLAY_AFTER_MILLIS + "," + UPDATED_DISPLAY_AFTER_MILLIS,
            "displayAfterMillis.in=" + UPDATED_DISPLAY_AFTER_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayAfterMillisIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayAfterMillis is not null
        defaultGridElementFiltering("displayAfterMillis.specified=true", "displayAfterMillis.specified=false");
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayAfterMillisIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayAfterMillis is greater than or equal to
        defaultGridElementFiltering(
            "displayAfterMillis.greaterThanOrEqual=" + DEFAULT_DISPLAY_AFTER_MILLIS,
            "displayAfterMillis.greaterThanOrEqual=" + UPDATED_DISPLAY_AFTER_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayAfterMillisIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayAfterMillis is less than or equal to
        defaultGridElementFiltering(
            "displayAfterMillis.lessThanOrEqual=" + DEFAULT_DISPLAY_AFTER_MILLIS,
            "displayAfterMillis.lessThanOrEqual=" + SMALLER_DISPLAY_AFTER_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayAfterMillisIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayAfterMillis is less than
        defaultGridElementFiltering(
            "displayAfterMillis.lessThan=" + UPDATED_DISPLAY_AFTER_MILLIS,
            "displayAfterMillis.lessThan=" + DEFAULT_DISPLAY_AFTER_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayAfterMillisIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayAfterMillis is greater than
        defaultGridElementFiltering(
            "displayAfterMillis.greaterThan=" + SMALLER_DISPLAY_AFTER_MILLIS,
            "displayAfterMillis.greaterThan=" + DEFAULT_DISPLAY_AFTER_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayDurationMillisIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayDurationMillis equals to
        defaultGridElementFiltering(
            "displayDurationMillis.equals=" + DEFAULT_DISPLAY_DURATION_MILLIS,
            "displayDurationMillis.equals=" + UPDATED_DISPLAY_DURATION_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayDurationMillisIsInShouldWork() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayDurationMillis in
        defaultGridElementFiltering(
            "displayDurationMillis.in=" + DEFAULT_DISPLAY_DURATION_MILLIS + "," + UPDATED_DISPLAY_DURATION_MILLIS,
            "displayDurationMillis.in=" + UPDATED_DISPLAY_DURATION_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayDurationMillisIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayDurationMillis is not null
        defaultGridElementFiltering("displayDurationMillis.specified=true", "displayDurationMillis.specified=false");
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayDurationMillisIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayDurationMillis is greater than or equal to
        defaultGridElementFiltering(
            "displayDurationMillis.greaterThanOrEqual=" + DEFAULT_DISPLAY_DURATION_MILLIS,
            "displayDurationMillis.greaterThanOrEqual=" + UPDATED_DISPLAY_DURATION_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayDurationMillisIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayDurationMillis is less than or equal to
        defaultGridElementFiltering(
            "displayDurationMillis.lessThanOrEqual=" + DEFAULT_DISPLAY_DURATION_MILLIS,
            "displayDurationMillis.lessThanOrEqual=" + SMALLER_DISPLAY_DURATION_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayDurationMillisIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayDurationMillis is less than
        defaultGridElementFiltering(
            "displayDurationMillis.lessThan=" + UPDATED_DISPLAY_DURATION_MILLIS,
            "displayDurationMillis.lessThan=" + DEFAULT_DISPLAY_DURATION_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByDisplayDurationMillisIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        // Get all the gridElementList where displayDurationMillis is greater than
        defaultGridElementFiltering(
            "displayDurationMillis.greaterThan=" + SMALLER_DISPLAY_DURATION_MILLIS,
            "displayDurationMillis.greaterThan=" + DEFAULT_DISPLAY_DURATION_MILLIS
        );
    }

    @Test
    @Transactional
    void getAllGridElementsByLayoutIsEqualToSomething() throws Exception {
        Layout layout;
        if (TestUtil.findAll(em, Layout.class).isEmpty()) {
            gridElementRepository.saveAndFlush(gridElement);
            layout = LayoutResourceIT.createEntity(em);
        } else {
            layout = TestUtil.findAll(em, Layout.class).get(0);
        }
        em.persist(layout);
        em.flush();
        gridElement.setLayout(layout);
        gridElementRepository.saveAndFlush(gridElement);
        Long layoutId = layout.getId();
        // Get all the gridElementList where layout equals to layoutId
        defaultGridElementShouldBeFound("layoutId.equals=" + layoutId);

        // Get all the gridElementList where layout equals to (layoutId + 1)
        defaultGridElementShouldNotBeFound("layoutId.equals=" + (layoutId + 1));
    }

    @Test
    @Transactional
    void getAllGridElementsByGridElementIsEqualToSomething() throws Exception {
        GridElement gridElement = null;
        if (TestUtil.findAll(em, GridElement.class).isEmpty()) {
            gridElementRepository.saveAndFlush(gridElement);
            gridElement = GridElementResourceIT.createEntity(em);
        } else {
            gridElement = TestUtil.findAll(em, GridElement.class).get(0);
        }
        em.persist(gridElement);
        em.flush();
        gridElement.setGridElement(gridElement);
        gridElementRepository.saveAndFlush(gridElement);
        Long gridElementId = gridElement.getId();
        // Get all the gridElementList where gridElement equals to gridElementId
        defaultGridElementShouldBeFound("gridElementId.equals=" + gridElementId);

        // Get all the gridElementList where gridElement equals to (gridElementId + 1)
        defaultGridElementShouldNotBeFound("gridElementId.equals=" + (gridElementId + 1));
    }

    private void defaultGridElementFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultGridElementShouldBeFound(shouldBeFound);
        defaultGridElementShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultGridElementShouldBeFound(String filter) throws Exception {
        restGridElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gridElement.getId().intValue())))
            .andExpect(jsonPath("$.[*].x").value(hasItem(DEFAULT_X)))
            .andExpect(jsonPath("$.[*].y").value(hasItem(DEFAULT_Y)))
            .andExpect(jsonPath("$.[*].w").value(hasItem(DEFAULT_W)))
            .andExpect(jsonPath("$.[*].h").value(hasItem(DEFAULT_H)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].displayAfterMillis").value(hasItem(DEFAULT_DISPLAY_AFTER_MILLIS.intValue())))
            .andExpect(jsonPath("$.[*].displayDurationMillis").value(hasItem(DEFAULT_DISPLAY_DURATION_MILLIS.intValue())));

        // Check, that the count call also returns 1
        restGridElementMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultGridElementShouldNotBeFound(String filter) throws Exception {
        restGridElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restGridElementMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingGridElement() throws Exception {
        // Get the gridElement
        restGridElementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGridElement() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridElement
        GridElement updatedGridElement = gridElementRepository.findById(gridElement.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGridElement are not directly saved in db
        em.detach(updatedGridElement);
        updatedGridElement
            .x(UPDATED_X)
            .y(UPDATED_Y)
            .w(UPDATED_W)
            .h(UPDATED_H)
            .content(UPDATED_CONTENT)
            .displayAfterMillis(UPDATED_DISPLAY_AFTER_MILLIS)
            .displayDurationMillis(UPDATED_DISPLAY_DURATION_MILLIS);
        GridElementDTO gridElementDTO = gridElementMapper.toDto(updatedGridElement);

        restGridElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gridElementDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(gridElementDTO))
            )
            .andExpect(status().isOk());

        // Validate the GridElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGridElementToMatchAllProperties(updatedGridElement);
    }

    @Test
    @Transactional
    void putNonExistingGridElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridElement.setId(longCount.incrementAndGet());

        // Create the GridElement
        GridElementDTO gridElementDTO = gridElementMapper.toDto(gridElement);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGridElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gridElementDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(gridElementDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GridElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGridElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridElement.setId(longCount.incrementAndGet());

        // Create the GridElement
        GridElementDTO gridElementDTO = gridElementMapper.toDto(gridElement);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGridElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(gridElementDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GridElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGridElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridElement.setId(longCount.incrementAndGet());

        // Create the GridElement
        GridElementDTO gridElementDTO = gridElementMapper.toDto(gridElement);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGridElementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gridElementDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GridElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGridElementWithPatch() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridElement using partial update
        GridElement partialUpdatedGridElement = new GridElement();
        partialUpdatedGridElement.setId(gridElement.getId());

        partialUpdatedGridElement.h(UPDATED_H).displayDurationMillis(UPDATED_DISPLAY_DURATION_MILLIS);

        restGridElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGridElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGridElement))
            )
            .andExpect(status().isOk());

        // Validate the GridElement in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGridElementUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedGridElement, gridElement),
            getPersistedGridElement(gridElement)
        );
    }

    @Test
    @Transactional
    void fullUpdateGridElementWithPatch() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridElement using partial update
        GridElement partialUpdatedGridElement = new GridElement();
        partialUpdatedGridElement.setId(gridElement.getId());

        partialUpdatedGridElement
            .x(UPDATED_X)
            .y(UPDATED_Y)
            .w(UPDATED_W)
            .h(UPDATED_H)
            .content(UPDATED_CONTENT)
            .displayAfterMillis(UPDATED_DISPLAY_AFTER_MILLIS)
            .displayDurationMillis(UPDATED_DISPLAY_DURATION_MILLIS);

        restGridElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGridElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGridElement))
            )
            .andExpect(status().isOk());

        // Validate the GridElement in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGridElementUpdatableFieldsEquals(partialUpdatedGridElement, getPersistedGridElement(partialUpdatedGridElement));
    }

    @Test
    @Transactional
    void patchNonExistingGridElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridElement.setId(longCount.incrementAndGet());

        // Create the GridElement
        GridElementDTO gridElementDTO = gridElementMapper.toDto(gridElement);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGridElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gridElementDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(gridElementDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GridElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGridElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridElement.setId(longCount.incrementAndGet());

        // Create the GridElement
        GridElementDTO gridElementDTO = gridElementMapper.toDto(gridElement);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGridElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(gridElementDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GridElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGridElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridElement.setId(longCount.incrementAndGet());

        // Create the GridElement
        GridElementDTO gridElementDTO = gridElementMapper.toDto(gridElement);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGridElementMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(gridElementDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GridElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGridElement() throws Exception {
        // Initialize the database
        insertedGridElement = gridElementRepository.saveAndFlush(gridElement);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the gridElement
        restGridElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, gridElement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return gridElementRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected GridElement getPersistedGridElement(GridElement gridElement) {
        return gridElementRepository.findById(gridElement.getId()).orElseThrow();
    }

    protected void assertPersistedGridElementToMatchAllProperties(GridElement expectedGridElement) {
        assertGridElementAllPropertiesEquals(expectedGridElement, getPersistedGridElement(expectedGridElement));
    }

    protected void assertPersistedGridElementToMatchUpdatableProperties(GridElement expectedGridElement) {
        assertGridElementAllUpdatablePropertiesEquals(expectedGridElement, getPersistedGridElement(expectedGridElement));
    }
}
