package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.AnnotationElementTestSamples.*;
import static de.andreasbubolz.annotator.domain.AnnotationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnnotationElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AnnotationElement.class);
        AnnotationElement annotationElement1 = getAnnotationElementSample1();
        AnnotationElement annotationElement2 = new AnnotationElement();
        assertThat(annotationElement1).isNotEqualTo(annotationElement2);

        annotationElement2.setId(annotationElement1.getId());
        assertThat(annotationElement1).isEqualTo(annotationElement2);

        annotationElement2 = getAnnotationElementSample2();
        assertThat(annotationElement1).isNotEqualTo(annotationElement2);
    }

    @Test
    void annotationTest() {
        AnnotationElement annotationElement = getAnnotationElementRandomSampleGenerator();
        Annotation annotationBack = getAnnotationRandomSampleGenerator();

        annotationElement.setAnnotation(annotationBack);
        assertThat(annotationElement.getAnnotation()).isEqualTo(annotationBack);

        annotationElement.annotation(null);
        assertThat(annotationElement.getAnnotation()).isNull();
    }
}
