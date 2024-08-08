package de.andreasbubolz.annotator.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import de.andreasbubolz.annotator.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GridElementDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GridElementDTO.class);
        GridElementDTO gridElementDTO1 = new GridElementDTO();
        gridElementDTO1.setId(1L);
        GridElementDTO gridElementDTO2 = new GridElementDTO();
        assertThat(gridElementDTO1).isNotEqualTo(gridElementDTO2);
        gridElementDTO2.setId(gridElementDTO1.getId());
        assertThat(gridElementDTO1).isEqualTo(gridElementDTO2);
        gridElementDTO2.setId(2L);
        assertThat(gridElementDTO1).isNotEqualTo(gridElementDTO2);
        gridElementDTO1.setId(null);
        assertThat(gridElementDTO1).isNotEqualTo(gridElementDTO2);
    }
}
