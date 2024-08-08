package de.andreasbubolz.annotator.service.mapper;

import de.andreasbubolz.annotator.domain.GridElement;
import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.service.dto.GridElementDTO;
import de.andreasbubolz.annotator.service.dto.LayoutDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GridElement} and its DTO {@link GridElementDTO}.
 */
@Mapper(componentModel = "spring")
public interface GridElementMapper extends EntityMapper<GridElementDTO, GridElement> {
    @Mapping(target = "layout", source = "layout", qualifiedByName = "layoutId")
    @Mapping(target = "gridElement", source = "gridElement", qualifiedByName = "gridElementId")
    GridElementDTO toDto(GridElement s);

    @Named("layoutId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    LayoutDTO toDtoLayoutId(Layout layout);

    @Named("gridElementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GridElementDTO toDtoGridElementId(GridElement gridElement);
}
