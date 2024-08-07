package de.andreasbubolz.annotator.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LayoutDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(LayoutDTO.class);
        LayoutDTO layoutDTO1 = new LayoutDTO();
        layoutDTO1.setId(1L);
        LayoutDTO layoutDTO2 = new LayoutDTO();
        assertThat(layoutDTO1).isNotEqualTo(layoutDTO2);
        layoutDTO2.setId(layoutDTO1.getId());
        assertThat(layoutDTO1).isEqualTo(layoutDTO2);
        layoutDTO2.setId(2L);
        assertThat(layoutDTO1).isNotEqualTo(layoutDTO2);
        layoutDTO1.setId(null);
        assertThat(layoutDTO1).isNotEqualTo(layoutDTO2);
    }
}
