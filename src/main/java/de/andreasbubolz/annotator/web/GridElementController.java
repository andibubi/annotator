// GridElementController.java
package de.andreasbubolz.annotator.web;

import de.andreasbubolz.annotator.domain.GridElement;
import de.andreasbubolz.annotator.repository.GridElementRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//@RestController
//@RequestMapping("/api/grid-elements")
public class GridElementController {

    @Autowired
    private GridElementRepository gridElementRepository;

    @GetMapping
    public List<GridElement> getAllGridElements() {
        return List.of(new GridElement());
        //return gridElementRepository.findAll();
    }

    // GridElementController.java
    @GetMapping("/layouts/{layoutId}/grid-elements")
    public List<GridElement> getGridElementsByLayout(@PathVariable Long layoutId) {
        return gridElementRepository.findByLayoutId(layoutId);
    }

    @PostMapping
    public GridElement createGridElement(@RequestBody GridElement gridElement) {
        return gridElementRepository.save(gridElement);
    }
}
