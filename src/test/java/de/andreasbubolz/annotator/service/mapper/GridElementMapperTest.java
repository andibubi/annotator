package de.andreasbubolz.annotator.service.mapper;

import static de.andreasbubolz.annotator.domain.GridElementAsserts.*;
import static de.andreasbubolz.annotator.domain.GridElementTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GridElementMapperTest {

    private GridElementMapper gridElementMapper;

    @BeforeEach
    void setUp() {
        gridElementMapper = new GridElementMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getGridElementSample1();
        var actual = gridElementMapper.toEntity(gridElementMapper.toDto(expected));
        assertGridElementAllPropertiesEquals(expected, actual);
    }
}
