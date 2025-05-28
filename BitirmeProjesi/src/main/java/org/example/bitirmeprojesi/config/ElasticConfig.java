package org.example.bitirmeprojesi.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.rest_client.RestClientTransport;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import java.io.FileInputStream;
import java.security.KeyStore;
import java.security.SecureRandom;
@Configuration
@EnableElasticsearchRepositories(basePackages = "org.example.bitirmeprojesi.repository")
public class ElasticConfig {

    @Value("${spring.elasticsearch.restclient.ssl.key-store}")
    private String keyStorePath;

    @Value("${spring.elasticsearch.restclient.ssl.key-store-password}")
    private String keyStorePassword;

    @Value("${spring.elasticsearch.restclient.ssl.trust-store}")
    private String trustStorePath;

    @Value("${spring.elasticsearch.restclient.ssl.trust-store-password}")
    private String trustStorePassword;

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        try {
            // SSL bağlamını oluştur
            SSLContext sslContext = createSSLContext();

            // HTTPS istemcisi oluştur
            CloseableHttpClient httpClient = HttpClients.custom()
                    .setSSLContext(sslContext)
                    .build();

            // RestClient oluştur
            RestClient restClient = RestClient.builder(
                            new HttpHost("localhost", 9200, "https")) // Elasticsearch URL ve HTTPS bağlantısı
                    .setHttpClientConfigCallback(httpClientBuilder ->
                            httpClientBuilder.setSSLContext(sslContext)
                                    .setDefaultCredentialsProvider(createCredentialsProvider())) // Kimlik doğrulama ekleniyor
                    .build();

            // Elasticsearch istemcisini oluştur ve döndür
            return new ElasticsearchClient(new RestClientTransport(restClient, new JacksonJsonpMapper()));

        } catch (Exception e) {
            throw new RuntimeException("Elasticsearch istemcisi oluşturulamadı: " + e.getMessage(), e);
        }
    }

    private CredentialsProvider createCredentialsProvider() {
        CredentialsProvider provider = new BasicCredentialsProvider();
        provider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials("elastic", "123456B"));
        return provider;
    }

    private SSLContext createSSLContext() throws Exception {
        // Keystore ve TrustStore dosyalarını yükle
        KeyStore keyStore = KeyStore.getInstance("PKCS12");
        try (FileInputStream keyStoreInputStream = new FileInputStream(keyStorePath)) {
            keyStore.load(keyStoreInputStream, keyStorePassword.toCharArray());
        }

        // TrustStore oluşturuluyor
        KeyStore trustStore = KeyStore.getInstance("JKS");
        try (FileInputStream trustStoreInputStream = new FileInputStream(trustStorePath)) {
            trustStore.load(trustStoreInputStream, trustStorePassword.toCharArray());
        }

        // TrustManagerFactory oluşturuluyor
        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(trustStore);

        // KeyManagerFactory oluşturuluyor
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        keyManagerFactory.init(keyStore, keyStorePassword.toCharArray());

        // SSLContext oluşturuluyor
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(keyManagerFactory.getKeyManagers(), trustManagerFactory.getTrustManagers(), new SecureRandom());

        return sslContext;
    }
}
