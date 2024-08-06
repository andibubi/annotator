package de.andreasbubolz.annotator.service;

import com.google.zxing.WriterException;
import de.andreasbubolz.annotator.repository.AnnotationRepository;
import de.andreasbubolz.annotator.repository.TextAnnotationElementRepository;
import de.andreasbubolz.annotator.repository.VideoAnnotationElementRepository;
import de.andreasbubolz.annotator.service.dto.AnnotationWithElementsDTO;
import java.io.IOException;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ViewerService {

    private final AnnotationRepository annotationRepository;
    private final TextAnnotationElementRepository textAnnotationElementRepository;
    private final VideoAnnotationElementRepository videoAnnotationElementRepository;

    public ViewerService(
        AnnotationRepository annotationRepository,
        TextAnnotationElementRepository textAnnotationElementRepository,
        VideoAnnotationElementRepository videoAnnotationElementRepository
    ) {
        this.annotationRepository = annotationRepository;
        this.textAnnotationElementRepository = textAnnotationElementRepository;
        this.videoAnnotationElementRepository = videoAnnotationElementRepository;
    }

    public AnnotationWithElementsDTO findOne(Long annotationId) throws WriterException, IOException {
        var annotationOpt = annotationRepository.findById(annotationId);
        if (annotationOpt.isPresent()) {
            var dto = new AnnotationWithElementsDTO();
            dto.annotation = annotationOpt.get();
            dto.textAnnotationElements = textAnnotationElementRepository.findAllByAnnotationId(annotationId);
            dto.videoAnnotationElements = videoAnnotationElementRepository.findAllByAnnotationId(annotationId);
            return dto;
        } else return null;
    }
}
