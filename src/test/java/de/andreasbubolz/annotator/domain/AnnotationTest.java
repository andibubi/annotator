package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.AnnotationElementTestSamples.*;
import static de.andreasbubolz.annotator.domain.AnnotationTestSamples.*;
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
    void annotationElementTest() {
        Annotation annotation = getAnnotationRandomSampleGenerator();
        AnnotationElement annotationElementBack = getAnnotationElementRandomSampleGenerator();

        annotation.addAnnotationElement(annotationElementBack);
        assertThat(annotation.getAnnotationElements()).containsOnly(annotationElementBack);
        assertThat(annotationElementBack.getAnnotation()).isEqualTo(annotation);

        annotation.removeAnnotationElement(annotationElementBack);
        assertThat(annotation.getAnnotationElements()).doesNotContain(annotationElementBack);
        assertThat(annotationElementBack.getAnnotation()).isNull();

        annotation.annotationElements(new HashSet<>(Set.of(annotationElementBack)));
        assertThat(annotation.getAnnotationElements()).containsOnly(annotationElementBack);
        assertThat(annotationElementBack.getAnnotation()).isEqualTo(annotation);

        annotation.setAnnotationElements(new HashSet<>());
        assertThat(annotation.getAnnotationElements()).doesNotContain(annotationElementBack);
        assertThat(annotationElementBack.getAnnotation()).isNull();
    }
}
