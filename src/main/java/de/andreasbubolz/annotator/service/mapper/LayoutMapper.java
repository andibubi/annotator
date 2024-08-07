package de.andreasbubolz.annotator.service.mapper;

import de.andreasbubolz.annotator.domain.Layout;
import de.andreasbubolz.annotator.domain.User;
import de.andreasbubolz.annotator.service.dto.LayoutDTO;
import de.andreasbubolz.annotator.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Layout} and its DTO {@link LayoutDTO}.
 */
@Mapper(componentModel = "spring")
public interface LayoutMapper extends EntityMapper<LayoutDTO, Layout> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    LayoutDTO toDto(Layout s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
