package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.GridElementTestSamples.*;
import static de.andreasbubolz.annotator.domain.LayoutTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class LayoutTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Layout.class);
        Layout layout1 = getLayoutSample1();
        Layout layout2 = new Layout();
        assertThat(layout1).isNotEqualTo(layout2);

        layout2.setId(layout1.getId());
        assertThat(layout1).isEqualTo(layout2);

        layout2 = getLayoutSample2();
        assertThat(layout1).isNotEqualTo(layout2);
    }

    @Test
    void grtidWElementsTest() {
        Layout layout = getLayoutRandomSampleGenerator();
        GridElement gridElementBack = getGridElementRandomSampleGenerator();

        layout.addGrtidWElements(gridElementBack);
        assertThat(layout.getGrtidWElements()).containsOnly(gridElementBack);
        assertThat(gridElementBack.getLayout()).isEqualTo(layout);

        layout.removeGrtidWElements(gridElementBack);
        assertThat(layout.getGrtidWElements()).doesNotContain(gridElementBack);
        assertThat(gridElementBack.getLayout()).isNull();

        layout.gridElements(new HashSet<>(Set.of(gridElementBack)));
        assertThat(layout.getGrtidWElements()).containsOnly(gridElementBack);
        assertThat(gridElementBack.getLayout()).isEqualTo(layout);

        layout.setGrtidWElements(new HashSet<>());
        assertThat(layout.getGrtidWElements()).doesNotContain(gridElementBack);
        assertThat(gridElementBack.getLayout()).isNull();
    }
}
