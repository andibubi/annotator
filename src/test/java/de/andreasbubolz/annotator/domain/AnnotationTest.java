package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.AnnotationTestSamples.*;
import static de.andreasbubolz.annotator.domain.TextAnnotationElementTestSamples.*;
import static de.andreasbubolz.annotator.domain.VideoAnnotationElementTestSamples.*;
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

    @Test
    void videoAnnotationElementTest() {
        Annotation annotation = getAnnotationRandomSampleGenerator();
        VideoAnnotationElement videoAnnotationElementBack = getVideoAnnotationElementRandomSampleGenerator();

        annotation.addVideoAnnotationElement(videoAnnotationElementBack);
        assertThat(annotation.getVideoAnnotationElements()).containsOnly(videoAnnotationElementBack);
        assertThat(videoAnnotationElementBack.getAnnotation()).isEqualTo(annotation);

        annotation.removeVideoAnnotationElement(videoAnnotationElementBack);
        assertThat(annotation.getVideoAnnotationElements()).doesNotContain(videoAnnotationElementBack);
        assertThat(videoAnnotationElementBack.getAnnotation()).isNull();

        annotation.videoAnnotationElements(new HashSet<>(Set.of(videoAnnotationElementBack)));
        assertThat(annotation.getVideoAnnotationElements()).containsOnly(videoAnnotationElementBack);
        assertThat(videoAnnotationElementBack.getAnnotation()).isEqualTo(annotation);

        annotation.setVideoAnnotationElements(new HashSet<>());
        assertThat(annotation.getVideoAnnotationElements()).doesNotContain(videoAnnotationElementBack);
        assertThat(videoAnnotationElementBack.getAnnotation()).isNull();
    }

    @Test
    void ancestorTest() {
        Annotation annotation = getAnnotationRandomSampleGenerator();
        Annotation annotationBack = getAnnotationRandomSampleGenerator();

        annotation.setAncestor(annotationBack);
        assertThat(annotation.getAncestor()).isEqualTo(annotationBack);

        annotation.ancestor(null);
        assertThat(annotation.getAncestor()).isNull();
    }

    @Test
    void descendantsTest() {
        Annotation annotation = getAnnotationRandomSampleGenerator();
        Annotation annotationBack = getAnnotationRandomSampleGenerator();

        annotation.addDescendants(annotationBack);
        assertThat(annotation.getDescendants()).containsOnly(annotationBack);
        assertThat(annotationBack.getAncestor()).isEqualTo(annotation);

        annotation.removeDescendants(annotationBack);
        assertThat(annotation.getDescendants()).doesNotContain(annotationBack);
        assertThat(annotationBack.getAncestor()).isNull();

        annotation.descendants(new HashSet<>(Set.of(annotationBack)));
        assertThat(annotation.getDescendants()).containsOnly(annotationBack);
        assertThat(annotationBack.getAncestor()).isEqualTo(annotation);

        annotation.setDescendants(new HashSet<>());
        assertThat(annotation.getDescendants()).doesNotContain(annotationBack);
        assertThat(annotationBack.getAncestor()).isNull();
    }
}
