package de.andreasbubolz.annotator.web.rest;

import com.google.zxing.WriterException;
import de.andreasbubolz.annotator.service.GridElementService;
import de.andreasbubolz.annotator.service.LayoutService;
import de.andreasbubolz.annotator.service.QRCodeGeneratorService;
import de.andreasbubolz.annotator.service.ViewerService;
import de.andreasbubolz.annotator.service.dto.AnnotationWithElementsDTO;
import de.andreasbubolz.annotator.service.dto.GridElementDTO;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/") // TODO URLs aufräumen
public class PlayerController {

    @Autowired
    private QRCodeGeneratorService qrCodeGeneratorService;

    @Autowired
    private ViewerService viewerService;

    @Autowired
    private GridElementService gridElementService;

    @Autowired
    private LayoutService layoutService;

    @PutMapping("createBlablubb")
    public ResponseEntity<GridElementDTO> createGridElement(@RequestBody GridElementDTO gridElementDto) {
        return new ResponseEntity(layoutService.createOrUpdateGridElement(gridElementDto), HttpStatus.OK);
    }

    //
    //
    //
    // Es folgt Kram aus ViewerController:
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
