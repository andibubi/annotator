package de.andreasbubolz.annotator.web.rest;

import static de.andreasbubolz.annotator.domain.TextAnnotationElementAsserts.*;
import static de.andreasbubolz.annotator.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.andreasbubolz.annotator.IntegrationTest;
import de.andreasbubolz.annotator.domain.TextAnnotationElement;
import de.andreasbubolz.annotator.repository.TextAnnotationElementRepository;
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
 * Integration tests for the {@link TextAnnotationElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TextAnnotationElementResourceIT {

    private static final Integer DEFAULT_START_SEC = 1;
    private static final Integer UPDATED_START_SEC = 2;

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/text-annotation-elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TextAnnotationElementRepository textAnnotationElementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTextAnnotationElementMockMvc;

    private TextAnnotationElement textAnnotationElement;

    private TextAnnotationElement insertedTextAnnotationElement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TextAnnotationElement createEntity(EntityManager em) {
        TextAnnotationElement textAnnotationElement = new TextAnnotationElement().startSec(DEFAULT_START_SEC).text(DEFAULT_TEXT);
        return textAnnotationElement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TextAnnotationElement createUpdatedEntity(EntityManager em) {
        TextAnnotationElement textAnnotationElement = new TextAnnotationElement().startSec(UPDATED_START_SEC).text(UPDATED_TEXT);
        return textAnnotationElement;
    }

    @BeforeEach
    public void initTest() {
        textAnnotationElement = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedTextAnnotationElement != null) {
            textAnnotationElementRepository.delete(insertedTextAnnotationElement);
            insertedTextAnnotationElement = null;
        }
    }

    @Test
    @Transactional
    void createTextAnnotationElement() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TextAnnotationElement
        var returnedTextAnnotationElement = om.readValue(
            restTextAnnotationElementMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(textAnnotationElement)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TextAnnotationElement.class
        );

        // Validate the TextAnnotationElement in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTextAnnotationElementUpdatableFieldsEquals(
            returnedTextAnnotationElement,
            getPersistedTextAnnotationElement(returnedTextAnnotationElement)
        );

        insertedTextAnnotationElement = returnedTextAnnotationElement;
    }

    @Test
    @Transactional
    void createTextAnnotationElementWithExistingId() throws Exception {
        // Create the TextAnnotationElement with an existing ID
        textAnnotationElement.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTextAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(textAnnotationElement)))
            .andExpect(status().isBadRequest());

        // Validate the TextAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartSecIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        textAnnotationElement.setStartSec(null);

        // Create the TextAnnotationElement, which fails.

        restTextAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(textAnnotationElement)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTextIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        textAnnotationElement.setText(null);

        // Create the TextAnnotationElement, which fails.

        restTextAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(textAnnotationElement)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTextAnnotationElements() throws Exception {
        // Initialize the database
        insertedTextAnnotationElement = textAnnotationElementRepository.saveAndFlush(textAnnotationElement);

        // Get all the textAnnotationElementList
        restTextAnnotationElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(textAnnotationElement.getId().intValue())))
            .andExpect(jsonPath("$.[*].startSec").value(hasItem(DEFAULT_START_SEC)))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)));
    }

    @Test
    @Transactional
    void getTextAnnotationElement() throws Exception {
        // Initialize the database
        insertedTextAnnotationElement = textAnnotationElementRepository.saveAndFlush(textAnnotationElement);

        // Get the textAnnotationElement
        restTextAnnotationElementMockMvc
            .perform(get(ENTITY_API_URL_ID, textAnnotationElement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(textAnnotationElement.getId().intValue()))
            .andExpect(jsonPath("$.startSec").value(DEFAULT_START_SEC))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT));
    }

    @Test
    @Transactional
    void getNonExistingTextAnnotationElement() throws Exception {
        // Get the textAnnotationElement
        restTextAnnotationElementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTextAnnotationElement() throws Exception {
        // Initialize the database
        insertedTextAnnotationElement = textAnnotationElementRepository.saveAndFlush(textAnnotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the textAnnotationElement
        TextAnnotationElement updatedTextAnnotationElement = textAnnotationElementRepository
            .findById(textAnnotationElement.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedTextAnnotationElement are not directly saved in db
        em.detach(updatedTextAnnotationElement);
        updatedTextAnnotationElement.startSec(UPDATED_START_SEC).text(UPDATED_TEXT);

        restTextAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTextAnnotationElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTextAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the TextAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTextAnnotationElementToMatchAllProperties(updatedTextAnnotationElement);
    }

    @Test
    @Transactional
    void putNonExistingTextAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        textAnnotationElement.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTextAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, textAnnotationElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(textAnnotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTextAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        textAnnotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTextAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(textAnnotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTextAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        textAnnotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTextAnnotationElementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(textAnnotationElement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TextAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTextAnnotationElementWithPatch() throws Exception {
        // Initialize the database
        insertedTextAnnotationElement = textAnnotationElementRepository.saveAndFlush(textAnnotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the textAnnotationElement using partial update
        TextAnnotationElement partialUpdatedTextAnnotationElement = new TextAnnotationElement();
        partialUpdatedTextAnnotationElement.setId(textAnnotationElement.getId());

        restTextAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTextAnnotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTextAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the TextAnnotationElement in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTextAnnotationElementUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTextAnnotationElement, textAnnotationElement),
            getPersistedTextAnnotationElement(textAnnotationElement)
        );
    }

    @Test
    @Transactional
    void fullUpdateTextAnnotationElementWithPatch() throws Exception {
        // Initialize the database
        insertedTextAnnotationElement = textAnnotationElementRepository.saveAndFlush(textAnnotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the textAnnotationElement using partial update
        TextAnnotationElement partialUpdatedTextAnnotationElement = new TextAnnotationElement();
        partialUpdatedTextAnnotationElement.setId(textAnnotationElement.getId());

        partialUpdatedTextAnnotationElement.startSec(UPDATED_START_SEC).text(UPDATED_TEXT);

        restTextAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTextAnnotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTextAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the TextAnnotationElement in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTextAnnotationElementUpdatableFieldsEquals(
            partialUpdatedTextAnnotationElement,
            getPersistedTextAnnotationElement(partialUpdatedTextAnnotationElement)
        );
    }

    @Test
    @Transactional
    void patchNonExistingTextAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        textAnnotationElement.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTextAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, textAnnotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(textAnnotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTextAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        textAnnotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTextAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(textAnnotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTextAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        textAnnotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTextAnnotationElementMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(textAnnotationElement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TextAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTextAnnotationElement() throws Exception {
        // Initialize the database
        insertedTextAnnotationElement = textAnnotationElementRepository.saveAndFlush(textAnnotationElement);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the textAnnotationElement
        restTextAnnotationElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, textAnnotationElement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return textAnnotationElementRepository.count();
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

    protected TextAnnotationElement getPersistedTextAnnotationElement(TextAnnotationElement textAnnotationElement) {
        return textAnnotationElementRepository.findById(textAnnotationElement.getId()).orElseThrow();
    }

    protected void assertPersistedTextAnnotationElementToMatchAllProperties(TextAnnotationElement expectedTextAnnotationElement) {
        assertTextAnnotationElementAllPropertiesEquals(
            expectedTextAnnotationElement,
            getPersistedTextAnnotationElement(expectedTextAnnotationElement)
        );
    }

    protected void assertPersistedTextAnnotationElementToMatchUpdatableProperties(TextAnnotationElement expectedTextAnnotationElement) {
        assertTextAnnotationElementAllUpdatablePropertiesEquals(
            expectedTextAnnotationElement,
            getPersistedTextAnnotationElement(expectedTextAnnotationElement)
        );
    }
}
