package org.example.bitirmeprojesi.util;

import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.JwtNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public class JwtUtil {


    public static UUID getUserIdFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt)) {
            throw new JwtNotFoundException(ErrorMesage.JWT_TOKEN_NOT_FOUND_ERROR);
        }
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return UUID.fromString(jwt.getClaimAsString("userId"));

    }
    public static String getToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt)) {
            throw new JwtNotFoundException(ErrorMesage.JWT_TOKEN_NOT_FOUND_ERROR);
        }
        Jwt jwt = (Jwt) authentication.getPrincipal();

        return jwt.getTokenValue();
    }



}
