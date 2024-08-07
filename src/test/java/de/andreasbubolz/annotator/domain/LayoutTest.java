package de.andreasbubolz.annotator.domain;

import static de.andreasbubolz.annotator.domain.LayoutTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
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
}
