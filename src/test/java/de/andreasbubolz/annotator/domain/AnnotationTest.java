package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.AnnotationTestSamples.*;
import static de.andreasbubolz.annotator.domain.TextAnnotationElementTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AnnotationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Annotation.class);
        Annotation annotation1 = getAnnotationSample1();
        Annotation annotation2 = new Annotation();
        assertThat(annotation1).isNotEqualTo(annotation2);

        annotation2.setId(annotation1.getId());
        assertThat(annotation1).isEqualTo(annotation2);

        annotation2 = getAnnotationSample2();
        assertThat(annotation1).isNotEqualTo(annotation2);
    }

    @Test
    void textAnnotationElementTest() {
        Annotation annotation = getAnnotationRandomSampleGenerator();
        TextAnnotationElement textAnnotationElementBack = getTextAnnotationElementRandomSampleGenerator();

        annotation.addTextAnnotationElement(textAnnotationElementBack);
        assertThat(annotation.getTextAnnotationElements()).containsOnly(textAnnotationElementBack);
        assertThat(textAnnotationElementBack.getAnnotation()).isEqualTo(annotation);

        annotation.removeTextAnnotationElement(textAnnotationElementBack);
        assertThat(annotation.getTextAnnotationElements()).doesNotContain(textAnnotationElementBack);
        assertThat(textAnnotationElementBack.getAnnotation()).isNull();

        annotation.textAnnotationElements(new HashSet<>(Set.of(textAnnotationElementBack)));
        assertThat(annotation.getTextAnnotationElements()).containsOnly(textAnnotationElementBack);
        assertThat(textAnnotationElementBack.getAnnotation()).isEqualTo(annotation);

        annotation.setTextAnnotationElements(new HashSet<>());
        assertThat(annotation.getTextAnnotationElements()).doesNotContain(textAnnotationElementBack);
        assertThat(textAnnotationElementBack.getAnnotation()).isNull();
    }
}
