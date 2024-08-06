package de.andreasbubolz.annotator.web.rest;

import com.google.zxing.WriterException;
import de.andreasbubolz.annotator.service.QRCodeGeneratorService;
import de.andreasbubolz.annotator.service.ViewerService;
import de.andreasbubolz.annotator.service.dto.AnnotationWithElementsDTO;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ViewerController {

    @Autowired
    private QRCodeGeneratorService qrCodeGeneratorService;

    @Autowired
    private ViewerService viewerService;

    @GetMapping("/viewUrl/{id}")
    public Map<String, String> generateQRCode(@PathVariable("id") Long annotationId, HttpServletRequest request) {
        var response = new HashMap<String, String>();
        try {
            var url =
                request.getScheme() +
                "://" +
                request.getServerName() +
                ":" +
                request.getServerPort() +
                request.getContextPath() +
                "/view/" +
                annotationId;
            response.put("url", url);
            response.put("qrCode", qrCodeGeneratorService.generateQRCode(url, 200, 200));
        } catch (WriterException | IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @GetMapping("/view/{id}")
    public AnnotationWithElementsDTO view(@PathVariable("id") Long annotationId) throws IOException, WriterException {
        return viewerService.findOne(annotationId);
    }
}
