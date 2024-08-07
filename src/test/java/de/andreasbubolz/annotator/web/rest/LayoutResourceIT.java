package de.andreasbubolz.annotator.web.rest;

import static de.andreasbubolz.annotator.domain.LayoutAsserts.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.andreasbubolz.annotator.IntegrationTest;
import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.domain.User;
import de.andreasbubolz.annotator.repository.LayoutRepository;
import de.andreasbubolz.annotator.repository.UserRepository;
import de.andreasbubolz.annotator.service.LayoutService;
import de.andreasbubolz.annotator.service.mapper.LayoutMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LayoutResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LayoutResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/layouts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LayoutRepository layoutRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private LayoutRepository layoutRepositoryMock;

    @Autowired
    private LayoutMapper layoutMapper;

    @Mock
    private LayoutService layoutServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLayoutMockMvc;

    private Layout layout;

    private Layout insertedLayout;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Layout createEntity(EntityManager em) {
        Layout layout = new Layout().name(DEFAULT_NAME).created_at(DEFAULT_CREATED_AT).updated_at(DEFAULT_UPDATED_AT);
        return layout;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Layout createUpdatedEntity(EntityManager em) {
        Layout layout = new Layout().name(UPDATED_NAME).created_at(UPDATED_CREATED_AT).updated_at(UPDATED_UPDATED_AT);
        return layout;
    }

    @BeforeEach
    public void initTest() {
        layout = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedLayout != null) {
            layoutRepository.delete(insertedLayout);
            insertedLayout = null;
        }
    }

    @Test
    @Transactional
    void getAllLayouts() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList
        restLayoutMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(layout.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updated_at").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLayoutsWithEagerRelationshipsIsEnabled() throws Exception {
        when(layoutServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLayoutMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(layoutServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLayoutsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(layoutServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLayoutMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(layoutRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getLayout() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get the layout
        restLayoutMockMvc
            .perform(get(ENTITY_API_URL_ID, layout.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(layout.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.created_at").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updated_at").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getLayoutsByIdFiltering() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        Long id = layout.getId();

        defaultLayoutFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultLayoutFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultLayoutFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllLayoutsByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where name equals to
        defaultLayoutFiltering("name.equals=" + DEFAULT_NAME, "name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllLayoutsByNameIsInShouldWork() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where name in
        defaultLayoutFiltering("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME, "name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllLayoutsByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where name is not null
        defaultLayoutFiltering("name.specified=true", "name.specified=false");
    }

    @Test
    @Transactional
    void getAllLayoutsByNameContainsSomething() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where name contains
        defaultLayoutFiltering("name.contains=" + DEFAULT_NAME, "name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllLayoutsByNameNotContainsSomething() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where name does not contain
        defaultLayoutFiltering("name.doesNotContain=" + UPDATED_NAME, "name.doesNotContain=" + DEFAULT_NAME);
    }

    @Test
    @Transactional
    void getAllLayoutsByCreated_atIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where created_at equals to
        defaultLayoutFiltering("created_at.equals=" + DEFAULT_CREATED_AT, "created_at.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllLayoutsByCreated_atIsInShouldWork() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where created_at in
        defaultLayoutFiltering("created_at.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT, "created_at.in=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllLayoutsByCreated_atIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where created_at is not null
        defaultLayoutFiltering("created_at.specified=true", "created_at.specified=false");
    }

    @Test
    @Transactional
    void getAllLayoutsByUpdated_atIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where updated_at equals to
        defaultLayoutFiltering("updated_at.equals=" + DEFAULT_UPDATED_AT, "updated_at.equals=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllLayoutsByUpdated_atIsInShouldWork() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where updated_at in
        defaultLayoutFiltering("updated_at.in=" + DEFAULT_UPDATED_AT + "," + UPDATED_UPDATED_AT, "updated_at.in=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllLayoutsByUpdated_atIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedLayout = layoutRepository.saveAndFlush(layout);

        // Get all the layoutList where updated_at is not null
        defaultLayoutFiltering("updated_at.specified=true", "updated_at.specified=false");
    }

    @Test
    @Transactional
    void getAllLayoutsByUserIsEqualToSomething() throws Exception {
        User user;
        if (TestUtil.findAll(em, User.class).isEmpty()) {
            layoutRepository.saveAndFlush(layout);
            user = UserResourceIT.createEntity(em);
        } else {
            user = TestUtil.findAll(em, User.class).get(0);
        }
        em.persist(user);
        em.flush();
        layout.setUser(user);
        layoutRepository.saveAndFlush(layout);
        Long userId = user.getId();
        // Get all the layoutList where user equals to userId
        defaultLayoutShouldBeFound("userId.equals=" + userId);

        // Get all the layoutList where user equals to (userId + 1)
        defaultLayoutShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    private void defaultLayoutFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultLayoutShouldBeFound(shouldBeFound);
        defaultLayoutShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultLayoutShouldBeFound(String filter) throws Exception {
        restLayoutMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(layout.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updated_at").value(hasItem(DEFAULT_UPDATED_AT.toString())));

        // Check, that the count call also returns 1
        restLayoutMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultLayoutShouldNotBeFound(String filter) throws Exception {
        restLayoutMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restLayoutMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingLayout() throws Exception {
        // Get the layout
        restLayoutMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    protected long getRepositoryCount() {
        return layoutRepository.count();
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

    protected Layout getPersistedLayout(Layout layout) {
        return layoutRepository.findById(layout.getId()).orElseThrow();
    }

    protected void assertPersistedLayoutToMatchAllProperties(Layout expectedLayout) {
        assertLayoutAllPropertiesEquals(expectedLayout, getPersistedLayout(expectedLayout));
    }

    protected void assertPersistedLayoutToMatchUpdatableProperties(Layout expectedLayout) {
        assertLayoutAllUpdatablePropertiesEquals(expectedLayout, getPersistedLayout(expectedLayout));
    }
}
