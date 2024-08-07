package de.andreasbubolz.annotator.web.rest;

import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.repository.LayoutRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/layouts")
public class LayoutController {

    @Autowired
    private LayoutRepository layoutRepository;

    @GetMapping
    public List<Layout> getAllLayouts() {
        return layoutRepository.findAll();
    }

    @PostMapping
    public Layout createLayout(@RequestBody Layout layout) {
        return layoutRepository.save(layout);
    }
}
