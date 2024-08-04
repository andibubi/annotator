package de.andreasbubolz.annotator.web.rest;

import de.andreasbubolz.annotator.domain.User;
import de.andreasbubolz.annotator.repository.UserRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class UserUtil {

    private static UserRepository userRepository;

    @Autowired
    public UserUtil(UserRepository userRepository) {
        UserUtil.userRepository = userRepository;
    }

    public static String getCurrentUserLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = null;
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetails) {
                UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
                userName = springSecurityUser.getUsername();
            } else if (authentication.getPrincipal() instanceof String) {
                userName = (String) authentication.getPrincipal();
            } else if (authentication instanceof JwtAuthenticationToken) {
                return authentication.getName();
            }
        }
        return userName;
    }

    public static User getCurrentUser() {
        String userLogin = getCurrentUserLogin();
        return userLogin == null ? null : userRepository.findOneByLogin(userLogin).orElse(null);
    }
}
