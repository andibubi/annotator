package de.andreasbubolz.annotator.web.rest;

import static de.andreasbubolz.annotator.domain.VideoAnnotationElementAsserts.*;
import static de.andreasbubolz.annotator.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.andreasbubolz.annotator.IntegrationTest;
import de.andreasbubolz.annotator.domain.VideoAnnotationElement;
import de.andreasbubolz.annotator.repository.VideoAnnotationElementRepository;
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
 * Integration tests for the {@link VideoAnnotationElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VideoAnnotationElementResourceIT {

    private static final Integer DEFAULT_START_SEC = 1;
    private static final Integer UPDATED_START_SEC = 2;

    private static final Integer DEFAULT_STOP_SEC = 1;
    private static final Integer UPDATED_STOP_SEC = 2;

    private static final String DEFAULT_VIDEO_ID = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO_ID = "BBBBBBBBBB";

    private static final Integer DEFAULT_VIDEO_START_SEC = 1;
    private static final Integer UPDATED_VIDEO_START_SEC = 2;

    private static final String ENTITY_API_URL = "/api/video-annotation-elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private VideoAnnotationElementRepository videoAnnotationElementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVideoAnnotationElementMockMvc;

    private VideoAnnotationElement videoAnnotationElement;

    private VideoAnnotationElement insertedVideoAnnotationElement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VideoAnnotationElement createEntity(EntityManager em) {
        VideoAnnotationElement videoAnnotationElement = new VideoAnnotationElement()
            .startSec(DEFAULT_START_SEC)
            .stopSec(DEFAULT_STOP_SEC)
            .videoId(DEFAULT_VIDEO_ID)
            .videoStartSec(DEFAULT_VIDEO_START_SEC);
        return videoAnnotationElement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VideoAnnotationElement createUpdatedEntity(EntityManager em) {
        VideoAnnotationElement videoAnnotationElement = new VideoAnnotationElement()
            .startSec(UPDATED_START_SEC)
            .stopSec(UPDATED_STOP_SEC)
            .videoId(UPDATED_VIDEO_ID)
            .videoStartSec(UPDATED_VIDEO_START_SEC);
        return videoAnnotationElement;
    }

    @BeforeEach
    public void initTest() {
        videoAnnotationElement = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedVideoAnnotationElement != null) {
            videoAnnotationElementRepository.delete(insertedVideoAnnotationElement);
            insertedVideoAnnotationElement = null;
        }
    }

    @Test
    @Transactional
    void createVideoAnnotationElement() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the VideoAnnotationElement
        var returnedVideoAnnotationElement = om.readValue(
            restVideoAnnotationElementMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(videoAnnotationElement)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            VideoAnnotationElement.class
        );

        // Validate the VideoAnnotationElement in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertVideoAnnotationElementUpdatableFieldsEquals(
            returnedVideoAnnotationElement,
            getPersistedVideoAnnotationElement(returnedVideoAnnotationElement)
        );

        insertedVideoAnnotationElement = returnedVideoAnnotationElement;
    }

    @Test
    @Transactional
    void createVideoAnnotationElementWithExistingId() throws Exception {
        // Create the VideoAnnotationElement with an existing ID
        videoAnnotationElement.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVideoAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(videoAnnotationElement)))
            .andExpect(status().isBadRequest());

        // Validate the VideoAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartSecIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        videoAnnotationElement.setStartSec(null);

        // Create the VideoAnnotationElement, which fails.

        restVideoAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(videoAnnotationElement)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStopSecIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        videoAnnotationElement.setStopSec(null);

        // Create the VideoAnnotationElement, which fails.

        restVideoAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(videoAnnotationElement)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVideoIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        videoAnnotationElement.setVideoId(null);

        // Create the VideoAnnotationElement, which fails.

        restVideoAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(videoAnnotationElement)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVideoStartSecIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        videoAnnotationElement.setVideoStartSec(null);

        // Create the VideoAnnotationElement, which fails.

        restVideoAnnotationElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(videoAnnotationElement)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVideoAnnotationElements() throws Exception {
        // Initialize the database
        insertedVideoAnnotationElement = videoAnnotationElementRepository.saveAndFlush(videoAnnotationElement);

        // Get all the videoAnnotationElementList
        restVideoAnnotationElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(videoAnnotationElement.getId().intValue())))
            .andExpect(jsonPath("$.[*].startSec").value(hasItem(DEFAULT_START_SEC)))
            .andExpect(jsonPath("$.[*].stopSec").value(hasItem(DEFAULT_STOP_SEC)))
            .andExpect(jsonPath("$.[*].videoId").value(hasItem(DEFAULT_VIDEO_ID)))
            .andExpect(jsonPath("$.[*].videoStartSec").value(hasItem(DEFAULT_VIDEO_START_SEC)));
    }

    @Test
    @Transactional
    void getVideoAnnotationElement() throws Exception {
        // Initialize the database
        insertedVideoAnnotationElement = videoAnnotationElementRepository.saveAndFlush(videoAnnotationElement);

        // Get the videoAnnotationElement
        restVideoAnnotationElementMockMvc
            .perform(get(ENTITY_API_URL_ID, videoAnnotationElement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(videoAnnotationElement.getId().intValue()))
            .andExpect(jsonPath("$.startSec").value(DEFAULT_START_SEC))
            .andExpect(jsonPath("$.stopSec").value(DEFAULT_STOP_SEC))
            .andExpect(jsonPath("$.videoId").value(DEFAULT_VIDEO_ID))
            .andExpect(jsonPath("$.videoStartSec").value(DEFAULT_VIDEO_START_SEC));
    }

    @Test
    @Transactional
    void getNonExistingVideoAnnotationElement() throws Exception {
        // Get the videoAnnotationElement
        restVideoAnnotationElementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVideoAnnotationElement() throws Exception {
        // Initialize the database
        insertedVideoAnnotationElement = videoAnnotationElementRepository.saveAndFlush(videoAnnotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the videoAnnotationElement
        VideoAnnotationElement updatedVideoAnnotationElement = videoAnnotationElementRepository
            .findById(videoAnnotationElement.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedVideoAnnotationElement are not directly saved in db
        em.detach(updatedVideoAnnotationElement);
        updatedVideoAnnotationElement
            .startSec(UPDATED_START_SEC)
            .stopSec(UPDATED_STOP_SEC)
            .videoId(UPDATED_VIDEO_ID)
            .videoStartSec(UPDATED_VIDEO_START_SEC);

        restVideoAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVideoAnnotationElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedVideoAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the VideoAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedVideoAnnotationElementToMatchAllProperties(updatedVideoAnnotationElement);
    }

    @Test
    @Transactional
    void putNonExistingVideoAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        videoAnnotationElement.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVideoAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, videoAnnotationElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(videoAnnotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the VideoAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVideoAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        videoAnnotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVideoAnnotationElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(videoAnnotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the VideoAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVideoAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        videoAnnotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVideoAnnotationElementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(videoAnnotationElement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VideoAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVideoAnnotationElementWithPatch() throws Exception {
        // Initialize the database
        insertedVideoAnnotationElement = videoAnnotationElementRepository.saveAndFlush(videoAnnotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the videoAnnotationElement using partial update
        VideoAnnotationElement partialUpdatedVideoAnnotationElement = new VideoAnnotationElement();
        partialUpdatedVideoAnnotationElement.setId(videoAnnotationElement.getId());

        partialUpdatedVideoAnnotationElement.videoStartSec(UPDATED_VIDEO_START_SEC);

        restVideoAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVideoAnnotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVideoAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the VideoAnnotationElement in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVideoAnnotationElementUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedVideoAnnotationElement, videoAnnotationElement),
            getPersistedVideoAnnotationElement(videoAnnotationElement)
        );
    }

    @Test
    @Transactional
    void fullUpdateVideoAnnotationElementWithPatch() throws Exception {
        // Initialize the database
        insertedVideoAnnotationElement = videoAnnotationElementRepository.saveAndFlush(videoAnnotationElement);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the videoAnnotationElement using partial update
        VideoAnnotationElement partialUpdatedVideoAnnotationElement = new VideoAnnotationElement();
        partialUpdatedVideoAnnotationElement.setId(videoAnnotationElement.getId());

        partialUpdatedVideoAnnotationElement
            .startSec(UPDATED_START_SEC)
            .stopSec(UPDATED_STOP_SEC)
            .videoId(UPDATED_VIDEO_ID)
            .videoStartSec(UPDATED_VIDEO_START_SEC);

        restVideoAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVideoAnnotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVideoAnnotationElement))
            )
            .andExpect(status().isOk());

        // Validate the VideoAnnotationElement in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVideoAnnotationElementUpdatableFieldsEquals(
            partialUpdatedVideoAnnotationElement,
            getPersistedVideoAnnotationElement(partialUpdatedVideoAnnotationElement)
        );
    }

    @Test
    @Transactional
    void patchNonExistingVideoAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        videoAnnotationElement.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVideoAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, videoAnnotationElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(videoAnnotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the VideoAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVideoAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        videoAnnotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVideoAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(videoAnnotationElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the VideoAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVideoAnnotationElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        videoAnnotationElement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVideoAnnotationElementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(videoAnnotationElement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VideoAnnotationElement in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVideoAnnotationElement() throws Exception {
        // Initialize the database
        insertedVideoAnnotationElement = videoAnnotationElementRepository.saveAndFlush(videoAnnotationElement);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the videoAnnotationElement
        restVideoAnnotationElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, videoAnnotationElement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return videoAnnotationElementRepository.count();
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

    protected VideoAnnotationElement getPersistedVideoAnnotationElement(VideoAnnotationElement videoAnnotationElement) {
        return videoAnnotationElementRepository.findById(videoAnnotationElement.getId()).orElseThrow();
    }

    protected void assertPersistedVideoAnnotationElementToMatchAllProperties(VideoAnnotationElement expectedVideoAnnotationElement) {
        assertVideoAnnotationElementAllPropertiesEquals(
            expectedVideoAnnotationElement,
            getPersistedVideoAnnotationElement(expectedVideoAnnotationElement)
        );
    }

    protected void assertPersistedVideoAnnotationElementToMatchUpdatableProperties(VideoAnnotationElement expectedVideoAnnotationElement) {
        assertVideoAnnotationElementAllUpdatablePropertiesEquals(
            expectedVideoAnnotationElement,
            getPersistedVideoAnnotationElement(expectedVideoAnnotationElement)
        );
    }
}
