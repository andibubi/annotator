package de.andreasbubolz.annotator.web.rest;

import static de.andreasbubolz.annotator.domain.AnnotationAsserts.*;
import static de.andreasbubolz.annotator.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.andreasbubolz.annotator.IntegrationTest;
import de.andreasbubolz.annotator.domain.Annotation;
import de.andreasbubolz.annotator.repository.AnnotationRepository;
import de.andreasbubolz.annotator.repository.UserRepository;
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
 * Integration tests for the {@link AnnotationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AnnotationResourceIT {

    private static final String DEFAULT_VIDEO_ID = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/annotations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AnnotationRepository annotationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnnotationMockMvc;

    private Annotation annotation;

    private Annotation insertedAnnotation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Annotation createEntity(EntityManager em) {
        Annotation annotation = new Annotation().videoId(DEFAULT_VIDEO_ID);
        return annotation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Annotation createUpdatedEntity(EntityManager em) {
        Annotation annotation = new Annotation().videoId(UPDATED_VIDEO_ID);
        return annotation;
    }

    @BeforeEach
    public void initTest() {
        annotation = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedAnnotation != null) {
            annotationRepository.delete(insertedAnnotation);
            insertedAnnotation = null;
        }
    }

    @Test
    @Transactional
    void createAnnotation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Annotation
        var returnedAnnotation = om.readValue(
            restAnnotationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotation)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Annotation.class
        );

        // Validate the Annotation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAnnotationUpdatableFieldsEquals(returnedAnnotation, getPersistedAnnotation(returnedAnnotation));

        insertedAnnotation = returnedAnnotation;
    }

    @Test
    @Transactional
    void createAnnotationWithExistingId() throws Exception {
        // Create the Annotation with an existing ID
        annotation.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnnotationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotation)))
            .andExpect(status().isBadRequest());

        // Validate the Annotation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkVideoIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        annotation.setVideoId(null);

        // Create the Annotation, which fails.

        restAnnotationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotation)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAnnotations() throws Exception {
        // Initialize the database
        insertedAnnotation = annotationRepository.saveAndFlush(annotation);

        // Get all the annotationList
        restAnnotationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(annotation.getId().intValue())))
            .andExpect(jsonPath("$.[*].videoId").value(hasItem(DEFAULT_VIDEO_ID)));
    }

    @Test
    @Transactional
    void getAnnotation() throws Exception {
        // Initialize the database
        insertedAnnotation = annotationRepository.saveAndFlush(annotation);

        // Get the annotation
        restAnnotationMockMvc
            .perform(get(ENTITY_API_URL_ID, annotation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(annotation.getId().intValue()))
            .andExpect(jsonPath("$.videoId").value(DEFAULT_VIDEO_ID));
    }

    @Test
    @Transactional
    void getNonExistingAnnotation() throws Exception {
        // Get the annotation
        restAnnotationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAnnotation() throws Exception {
        // Initialize the database
        insertedAnnotation = annotationRepository.saveAndFlush(annotation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the annotation
        Annotation updatedAnnotation = annotationRepository.findById(annotation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAnnotation are not directly saved in db
        em.detach(updatedAnnotation);
        updatedAnnotation.videoId(UPDATED_VIDEO_ID);

        restAnnotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnnotation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAnnotation))
            )
            .andExpect(status().isOk());

        // Validate the Annotation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAnnotationToMatchAllProperties(updatedAnnotation);
    }

    @Test
    @Transactional
    void putNonExistingAnnotation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnnotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, annotation.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Annotation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnnotation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(annotation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Annotation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnnotation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnotationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(annotation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Annotation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnnotationWithPatch() throws Exception {
        // Initialize the database
        insertedAnnotation = annotationRepository.saveAndFlush(annotation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the annotation using partial update
        Annotation partialUpdatedAnnotation = new Annotation();
        partialUpdatedAnnotation.setId(annotation.getId());

        restAnnotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnnotation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAnnotation))
            )
            .andExpect(status().isOk());

        // Validate the Annotation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAnnotationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAnnotation, annotation),
            getPersistedAnnotation(annotation)
        );
    }

    @Test
    @Transactional
    void fullUpdateAnnotationWithPatch() throws Exception {
        // Initialize the database
        insertedAnnotation = annotationRepository.saveAndFlush(annotation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the annotation using partial update
        Annotation partialUpdatedAnnotation = new Annotation();
        partialUpdatedAnnotation.setId(annotation.getId());

        partialUpdatedAnnotation.videoId(UPDATED_VIDEO_ID);

        restAnnotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnnotation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAnnotation))
            )
            .andExpect(status().isOk());

        // Validate the Annotation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAnnotationUpdatableFieldsEquals(partialUpdatedAnnotation, getPersistedAnnotation(partialUpdatedAnnotation));
    }

    @Test
    @Transactional
    void patchNonExistingAnnotation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnnotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, annotation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(annotation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Annotation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnnotation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(annotation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Annotation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnnotation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        annotation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnotationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(annotation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Annotation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnnotation() throws Exception {
        // Initialize the database
        insertedAnnotation = annotationRepository.saveAndFlush(annotation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the annotation
        restAnnotationMockMvc
            .perform(delete(ENTITY_API_URL_ID, annotation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return annotationRepository.count();
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

    protected Annotation getPersistedAnnotation(Annotation annotation) {
        return annotationRepository.findById(annotation.getId()).orElseThrow();
    }

    protected void assertPersistedAnnotationToMatchAllProperties(Annotation expectedAnnotation) {
        assertAnnotationAllPropertiesEquals(expectedAnnotation, getPersistedAnnotation(expectedAnnotation));
    }

    protected void assertPersistedAnnotationToMatchUpdatableProperties(Annotation expectedAnnotation) {
        assertAnnotationAllUpdatablePropertiesEquals(expectedAnnotation, getPersistedAnnotation(expectedAnnotation));
    }
}
