package org.example.bitirmeprojesi.util;

import java.security.SecureRandom;

public class VerificationCodeGenerator {

    private static final SecureRandom random = new SecureRandom();
    private static final int CODE_LENGTH = 6;

    public static String generateCode() {
        int code = random.nextInt((int) Math.pow(10, CODE_LENGTH));
        return String.format("%06d", code);
    }

}
