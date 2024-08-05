package de.andreasbubolz.annotator.web.rest;

import com.google.zxing.WriterException;
import de.andreasbubolz.annotator.domain.Annotation;
import de.andreasbubolz.annotator.service.QRCodeGeneratorService;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnnotationController {

    @Autowired
    private QRCodeGeneratorService qrCodeGeneratorService;

    @GetMapping("/viewUrl/{id}")
    public Map<String, String> generateQRCode(@PathVariable("id") Long annotationId) {
        Map<String, String> response = new HashMap<>();
        try {
            var url = "www.andreas-bubolz.de/annotator/view/" + annotationId;
            response.put("url", url);
            response.put("qrCode", qrCodeGeneratorService.generateQRCode(url, 200, 200));
        } catch (WriterException | IOException e) {
            e.printStackTrace();
        }
        return response;
    }
}
