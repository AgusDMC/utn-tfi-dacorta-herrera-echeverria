package com.tfi.inmobiliaria.imagenpropiedad.cloudinary;

import com.cloudinary.Cloudinary;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@EnableConfigurationProperties(CloudinaryPropiedades.class)
public class CloudinaryConfiguracion {

    @Bean
    public Cloudinary cloudinary(CloudinaryPropiedades propiedades) {
        return new Cloudinary(Map.of(
                "cloud_name", propiedades.getCloudName(),
                "api_key", propiedades.getApiKey(),
                "api_secret", propiedades.getApiSecret(),
                "secure", true
        ));
    }
}