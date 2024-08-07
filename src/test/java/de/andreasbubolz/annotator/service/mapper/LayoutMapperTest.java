package de.andreasbubolz.annotator.service.mapper;

import static de.andreasbubolz.annotator.domain.LayoutAsserts.*;
import static de.andreasbubolz.annotator.domain.LayoutTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LayoutMapperTest {

    private LayoutMapper layoutMapper;

    @BeforeEach
    void setUp() {
        layoutMapper = new LayoutMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getLayoutSample1();
        var actual = layoutMapper.toEntity(layoutMapper.toDto(expected));
        assertLayoutAllPropertiesEquals(expected, actual);
    }
}
