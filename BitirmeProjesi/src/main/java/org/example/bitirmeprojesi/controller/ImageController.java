package org.example.bitirmeprojesi.controller;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.entity.Image;
import org.example.bitirmeprojesi.repository.ImageRepository;
import org.example.bitirmeprojesi.service.ImageService;
import org.example.bitirmeprojesi.util.ImageUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {


    private final ImageRepository imageRepository;
    private final ImageService imageService;



    @GetMapping("v1/info/{name}")
    public ResponseEntity<?> getImageInfoByName(@PathVariable("name") String name) {
         imageService.getInfoByImageByName(name);

        return ResponseEntity.status(HttpStatus.OK)
                .body(imageService.getInfoByImageByName(name));
    }

    @GetMapping("v1/{name}")
    public ResponseEntity<?> getImageByName(@PathVariable("name") String name) {
        byte[] image = imageService.getImage(name);

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(image);
    }


    @GetMapping("v1/infos/{id}")
    @Transactional
    public ResponseEntity<List<String>> getImageUrlsByProductId(@PathVariable("id") Long productId) {
        List<Image> dbImages = imageRepository.findByProductId(productId);
        List<String> imageBase64List = dbImages.stream()
                .map(dbImage -> Base64.getEncoder().encodeToString(ImageUtil.decompressImage(dbImage.getImage())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(imageBase64List);
    }




}
