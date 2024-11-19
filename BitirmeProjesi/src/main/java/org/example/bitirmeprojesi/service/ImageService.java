package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ImageDto;
import org.example.bitirmeprojesi.dto.ImageResponseDto;
import org.example.bitirmeprojesi.entity.Image;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.mapper.ImageMapper;
import org.example.bitirmeprojesi.repository.ImageRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.util.ImageUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;
    private final ImageMapper imageMapper;

    @Transactional
    public ImageResponseDto upload(MultipartFile file, Long productId) throws Exception {

        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

        imageRepository.save(Image.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .product(product)
                .image(ImageUtil.compressImage(file.getBytes())).build());

        return new ImageResponseDto("Image uploaded successfully: " +
                file.getOriginalFilename());
    }
    @Transactional
    public ImageDto getInfoByImageByName(String name) {

        Optional<Image> dbImageOptional = imageRepository.findByName(name);

        Image dbImage = dbImageOptional.orElseThrow(() ->
                new RuntimeException("No image found with the name: " + name));


        return imageMapper.toDto(dbImage);
    }

    @Transactional
    public byte[] getImage(String name) {
        Image dbImage = imageRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("No image found with the name: " + name));
        return ImageUtil.decompressImage(dbImage.getImage());
    }
    @Transactional
    public List<byte[]> getImages(Long productId) {
        List<Image> dbImages = imageRepository.findByProductId(productId);

        List<byte[]> images = new ArrayList<>();
        for (Image dbImage : dbImages) {
            images.add(ImageUtil.decompressImage(dbImage.getImage()));
        }

        return images;
    }

    public void delete(Long id) {
        imageRepository.deleteById(id);
    }



}
