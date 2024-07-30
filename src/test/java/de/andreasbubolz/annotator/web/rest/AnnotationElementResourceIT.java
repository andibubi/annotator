package de.andreasbubolz.annotator.web.rest;

import static de.andreasbubolz.annotator.domain.AnnotationElementAsserts.*;
import static de.andreasbubolz.annotator.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.andreasbubolz.annotator.IntegrationTest;
import de.andreasbubolz.annotator.domain.AnnotationElement;
import de.andreasbubolz.annotator.repository.AnnotationElementRepository;
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
 * Integration tests for the {@link AnnotationElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AnnotationElementResourceIT {

    private static final Integer DEFAULT_START_SEC = 1;
    private static final Integer UPDATED_START_SEC = 2;

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/annotation-elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AnnotationElementRepository annotationElementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnnotationElementMockMvc;

    private AnnotationElement annotationElement;

    private AnnotationElement insertedAnnotationElement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AnnotationElement createEntity(EntityManager em) {
        AnnotationElement annotationElement = new AnnotationElement().startSec(DEFAULT_START_SEC).text(DEFAULT_TEXT);
        return annotationElement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AnnotationElement createUpdatedEntity(EntityManager em) {
        AnnotationElement annotationElement = new AnnotationElement().startSec(UPDATED_START_SEC).text(UPDATED_TEXT);
        return annotationElement;
    }

    @BeforeEach
    public void initTest() {
        annotationElement = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedAnnotationElement != null) {
            annotationElementRepository.delete(insertedAnnotationElement);
            insertedAnnotationElement = null;
        }
    }

    @Test
    @Transactional
    void createAnnotationElement() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AnnotationElement
        var returnedAnnotationElement = om.readValue(
            restAnnotationElementMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotationElement)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AnnotationElement.class
        );

        // Validate the AnnotationElement in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAnnotationElementUpdatableFieldsEquals(returnedAnnotationElement, getPersistedAnnotationElement(returnedAnnotationElement));

        insertedAnnotationElement = returnedAnnotationElement;
    }

    @Test
    @Transactional
    void createAnnotationElementWithExistingId() throws Exception {
        // Create the AnnotationElement with an existing ID
        annotationElement.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotationElement)))
            .andExpect(status().isBadRequest());

        // Validate the AnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartSecIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        annotationElement.setStartSec(null);

        // Create the AnnotationElement, which fails.

        restAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotationElement)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTextIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        annotationElement.setText(null);

        // Create the AnnotationElement, which fails.

        restAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotationElement)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAnnotationElements() throws Exception {
        // Initialize the database
        insertedAnnotationElement = annotationElementRepository.saveAndFlush(annotationElement);

        // Get all the annotationElementList
        restAnnotationElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(annotationElement.getId().intValue())))
            .andExpect(jsonPath("$.[*].startSec").value(hasItem(DEFAULT_START_SEC)))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)));
    }

    @Test
    @Transactional
    void getAnnotationElement() throws Exception {
        // Initialize the database
        insertedAnnotationElement = annotationElementRepository.saveAndFlush(annotationElement);

        // Get the annotationElement
        restAnnotationElementMockMvc
            .perform(get(ENTITY_API_URL_ID, annotationElement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(annotationElement.getId().intValue()))
            .andExpect(jsonPath("$.startSec").value(DEFAULT_START_SEC))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT));
    }

    @Test
    @Transactional
    void getNonExistingAnnotationElement() throws Exception {
        // Get the annotationElement
        restAnnotationElementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAnnotationElement() throws Exception {
        // Initialize the database
        insertedAnnotationElement = annotationElementRepository.saveAndFlush(annotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the annotationElement
        AnnotationElement updatedAnnotationElement = annotationElementRepository.findById(annotationElement.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAnnotationElement are not directly saved in db
        em.detach(updatedAnnotationElement);
        updatedAnnotationElement.startSec(UPDATED_START_SEC).text(UPDATED_TEXT);

        restAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnnotationElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the AnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAnnotationElementToMatchAllProperties(updatedAnnotationElement);
    }

    @Test
    @Transactional
    void putNonExistingAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotationElement.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, annotationElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(annotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the AnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(annotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the AnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnotationElementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotationElement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnnotationElementWithPatch() throws Exception {
        // Initialize the database
        insertedAnnotationElement = annotationElementRepository.saveAndFlush(annotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the annotationElement using partial update
        AnnotationElement partialUpdatedAnnotationElement = new AnnotationElement();
        partialUpdatedAnnotationElement.setId(annotationElement.getId());

        restAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnnotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the AnnotationElement in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAnnotationElementUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAnnotationElement, annotationElement),
            getPersistedAnnotationElement(annotationElement)
        );
    }

    @Test
    @Transactional
    void fullUpdateAnnotationElementWithPatch() throws Exception {
        // Initialize the database
        insertedAnnotationElement = annotationElementRepository.saveAndFlush(annotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the annotationElement using partial update
        AnnotationElement partialUpdatedAnnotationElement = new AnnotationElement();
        partialUpdatedAnnotationElement.setId(annotationElement.getId());

        partialUpdatedAnnotationElement.startSec(UPDATED_START_SEC).text(UPDATED_TEXT);

        restAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnnotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the AnnotationElement in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAnnotationElementUpdatableFieldsEquals(
            partialUpdatedAnnotationElement,
            getPersistedAnnotationElement(partialUpdatedAnnotationElement)
        );
    }

    @Test
    @Transactional
    void patchNonExistingAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotationElement.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, annotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(annotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the AnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(annotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the AnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnotationElementMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(annotationElement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnnotationElement() throws Exception {
        // Initialize the database
        insertedAnnotationElement = annotationElementRepository.saveAndFlush(annotationElement);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the annotationElement
        restAnnotationElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, annotationElement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return annotationElementRepository.count();
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

    protected AnnotationElement getPersistedAnnotationElement(AnnotationElement annotationElement) {
        return annotationElementRepository.findById(annotationElement.getId()).orElseThrow();
    }

    protected void assertPersistedAnnotationElementToMatchAllProperties(AnnotationElement expectedAnnotationElement) {
        assertAnnotationElementAllPropertiesEquals(expectedAnnotationElement, getPersistedAnnotationElement(expectedAnnotationElement));
    }

    protected void assertPersistedAnnotationElementToMatchUpdatableProperties(AnnotationElement expectedAnnotationElement) {
        assertAnnotationElementAllUpdatablePropertiesEquals(
            expectedAnnotationElement,
            getPersistedAnnotationElement(expectedAnnotationElement)
        );
    }
}
