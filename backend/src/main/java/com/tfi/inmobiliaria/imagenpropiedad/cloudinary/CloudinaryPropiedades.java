package com.tfi.inmobiliaria.imagenpropiedad.cloudinary;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.cloudinary")
public class CloudinaryPropiedades {
    private String cloudName;
    private String apiKey;
    private String apiSecret;
}