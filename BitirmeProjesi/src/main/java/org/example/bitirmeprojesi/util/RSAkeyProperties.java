package org.example.bitirmeprojesi.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Component
@Getter
@Setter
public class RSAkeyProperties {


    private RSAPublicKey publicKey;
    private RSAPrivateKey privateKey;

    public RSAkeyProperties() {
        KeyPair pair = KeyGeneratorUtility.generateKeyPair();
        this.publicKey = (RSAPublicKey) pair.getPublic();
        this.privateKey = (RSAPrivateKey) pair.getPrivate();
    }


}
