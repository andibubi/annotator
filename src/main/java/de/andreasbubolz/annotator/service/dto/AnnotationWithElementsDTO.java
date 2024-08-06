package de.andreasbubolz.annotator.service.dto;

import de.andreasbubolz.annotator.domain.Annotation;
import de.andreasbubolz.annotator.domain.TextAnnotationElement;
import de.andreasbubolz.annotator.domain.VideoAnnotationElement;
import java.util.List;

public class AnnotationWithElementsDTO {

    public Annotation annotation;
    public List<TextAnnotationElement> textAnnotationElements;
    public List<VideoAnnotationElement> videoAnnotationElements;
}
