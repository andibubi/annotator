package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.AnnotationTestSamples.*;
import static de.andreasbubolz.annotator.domain.VideoAnnotationElementTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VideoAnnotationElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VideoAnnotationElement.class);
        VideoAnnotationElement videoAnnotationElement1 = getVideoAnnotationElementSample1();
        VideoAnnotationElement videoAnnotationElement2 = new VideoAnnotationElement();
        assertThat(videoAnnotationElement1).isNotEqualTo(videoAnnotationElement2);

        videoAnnotationElement2.setId(videoAnnotationElement1.getId());
        assertThat(videoAnnotationElement1).isEqualTo(videoAnnotationElement2);

        videoAnnotationElement2 = getVideoAnnotationElementSample2();
        assertThat(videoAnnotationElement1).isNotEqualTo(videoAnnotationElement2);
    }

    @Test
    void annotationTest() {
        VideoAnnotationElement videoAnnotationElement = getVideoAnnotationElementRandomSampleGenerator();
        Annotation annotationBack = getAnnotationRandomSampleGenerator();

        videoAnnotationElement.setAnnotation(annotationBack);
        assertThat(videoAnnotationElement.getAnnotation()).isEqualTo(annotationBack);

        videoAnnotationElement.annotation(null);
        assertThat(videoAnnotationElement.getAnnotation()).isNull();
    }
}
