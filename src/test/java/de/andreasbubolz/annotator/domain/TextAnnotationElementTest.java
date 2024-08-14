package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.AnnotationTestSamples.*;
import static de.andreasbubolz.annotator.domain.TextAnnotationElementTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TextAnnotationElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TextAnnotationElement.class);
        TextAnnotationElement textAnnotationElement1 = getTextAnnotationElementSample1();
        TextAnnotationElement textAnnotationElement2 = new TextAnnotationElement();
        assertThat(textAnnotationElement1).isNotEqualTo(textAnnotationElement2);

        textAnnotationElement2.setId(textAnnotationElement1.getId());
        assertThat(textAnnotationElement1).isEqualTo(textAnnotationElement2);

        textAnnotationElement2 = getTextAnnotationElementSample2();
        assertThat(textAnnotationElement1).isNotEqualTo(textAnnotationElement2);
    }

    @Test
    void annotationTest() {
        TextAnnotationElement textAnnotationElement = getTextAnnotationElementRandomSampleGenerator();
        Annotation annotationBack = getAnnotationRandomSampleGenerator();

        textAnnotationElement.setAnnotation(annotationBack);
        assertThat(textAnnotationElement.getAnnotation()).isEqualTo(annotationBack);

        textAnnotationElement.annotation(null);
        assertThat(textAnnotationElement.getAnnotation()).isNull();
    }
}
