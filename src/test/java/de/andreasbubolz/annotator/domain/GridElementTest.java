package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.GridElementTestSamples.*;
import static de.andreasbubolz.annotator.domain.GridElementTestSamples.*;
import static de.andreasbubolz.annotator.domain.LayoutTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GridElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GridElement.class);
        GridElement gridElement1 = getGridElementSample1();
        GridElement gridElement2 = new GridElement();
        assertThat(gridElement1).isNotEqualTo(gridElement2);

        gridElement2.setId(gridElement1.getId());
        assertThat(gridElement1).isEqualTo(gridElement2);

        gridElement2 = getGridElementSample2();
        assertThat(gridElement1).isNotEqualTo(gridElement2);
    }

    @Test
    void layoutTest() {
        GridElement gridElement = getGridElementRandomSampleGenerator();
        Layout layoutBack = getLayoutRandomSampleGenerator();

        gridElement.setLayout(layoutBack);
        assertThat(gridElement.getLayout()).isEqualTo(layoutBack);

        gridElement.layout(null);
        assertThat(gridElement.getLayout()).isNull();
    }

    @Test
    void gridElementTest() {
        GridElement gridElement = getGridElementRandomSampleGenerator();
        GridElement gridElementBack = getGridElementRandomSampleGenerator();

        gridElement.setGridElement(gridElementBack);
        assertThat(gridElement.getGridElement()).isEqualTo(gridElementBack);

        gridElement.gridElement(null);
        assertThat(gridElement.getGridElement()).isNull();
    }

    @Test
    void gridElementsTest() {
        GridElement gridElement = getGridElementRandomSampleGenerator();
        GridElement gridElementBack = getGridElementRandomSampleGenerator();

        gridElement.addGridElements(gridElementBack);
        assertThat(gridElement.getGridElements()).containsOnly(gridElementBack);
        assertThat(gridElementBack.getGridElement()).isEqualTo(gridElement);

        gridElement.removeGridElements(gridElementBack);
        assertThat(gridElement.getGridElements()).doesNotContain(gridElementBack);
        assertThat(gridElementBack.getGridElement()).isNull();

        gridElement.gridElements(new HashSet<>(Set.of(gridElementBack)));
        assertThat(gridElement.getGridElements()).containsOnly(gridElementBack);
        assertThat(gridElementBack.getGridElement()).isEqualTo(gridElement);

        gridElement.setGridElements(new HashSet<>());
        assertThat(gridElement.getGridElements()).doesNotContain(gridElementBack);
        assertThat(gridElementBack.getGridElement()).isNull();
    }
}
