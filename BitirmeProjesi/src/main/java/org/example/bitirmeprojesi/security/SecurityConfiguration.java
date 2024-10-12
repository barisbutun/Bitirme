package org.example.bitirmeprojesi.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.apache.catalina.webresources.TomcatURLStreamHandlerFactory.disable;

@Configuration
public class SecurityConfiguration {

   @Bean
    public PasswordEncoder passwordEncoder(){
       return new BCryptPasswordEncoder();
   }

   @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
       http
               .csrf(csrf -> csrf.disable())
               .authorizeHttpRequests(auth->{
                   auth.requestMatchers("api/product/**").permitAll();
                   auth.requestMatchers("api/order/**").permitAll();
                   auth.requestMatchers("api/category/**").permitAll();
                   auth.requestMatchers("api/order/").permitAll();
                   auth.requestMatchers("api/orderItems/**").permitAll();


               }).build();

       return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }



}
