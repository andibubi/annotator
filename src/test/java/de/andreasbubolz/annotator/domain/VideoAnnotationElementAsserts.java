package de.andreasbubolz.annotator.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class VideoAnnotationElementAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertVideoAnnotationElementAllPropertiesEquals(VideoAnnotationElement expected, VideoAnnotationElement actual) {
        assertVideoAnnotationElementAutoGeneratedPropertiesEquals(expected, actual);
        assertVideoAnnotationElementAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertVideoAnnotationElementAllUpdatablePropertiesEquals(
        VideoAnnotationElement expected,
        VideoAnnotationElement actual
    ) {
        assertVideoAnnotationElementUpdatableFieldsEquals(expected, actual);
        assertVideoAnnotationElementUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertVideoAnnotationElementAutoGeneratedPropertiesEquals(
        VideoAnnotationElement expected,
        VideoAnnotationElement actual
    ) {
        assertThat(expected)
            .as("Verify VideoAnnotationElement auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertVideoAnnotationElementUpdatableFieldsEquals(VideoAnnotationElement expected, VideoAnnotationElement actual) {
        assertThat(expected)
            .as("Verify VideoAnnotationElement relevant properties")
            .satisfies(e -> assertThat(e.getStartSec()).as("check startSec").isEqualTo(actual.getStartSec()))
            .satisfies(e -> assertThat(e.getStopSec()).as("check stopSec").isEqualTo(actual.getStopSec()))
            .satisfies(e -> assertThat(e.getVideoId()).as("check videoId").isEqualTo(actual.getVideoId()))
            .satisfies(e -> assertThat(e.getVideoStartSec()).as("check videoStartSec").isEqualTo(actual.getVideoStartSec()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertVideoAnnotationElementUpdatableRelationshipsEquals(
        VideoAnnotationElement expected,
        VideoAnnotationElement actual
    ) {
        assertThat(expected)
            .as("Verify VideoAnnotationElement relationships")
            .satisfies(e -> assertThat(e.getAnnotation()).as("check annotation").isEqualTo(actual.getAnnotation()));
    }
}
