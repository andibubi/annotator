package de.andreasbubolz.annotator.web.rest;

import static de.andreasbubolz.annotator.security.SecurityUtils.AUTHORITIES_KEY;
import static de.andreasbubolz.annotator.security.SecurityUtils.JWT_ALGORITHM;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.andreasbubolz.annotator.web.rest.vm.LoginVM;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
public class YoutubeController {

    @Value("${youtube.api-key}")
    private String youtubeApiKey;

    @GetMapping("/api/check-youtube-video")
    public ResponseEntity<String> checkYoutubeVideo(@RequestParam String videoId) {
        var url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + youtubeApiKey + "&part=id";
        var restTemplate = new RestTemplate();
        var result = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(result);
    }
}
