package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ImageResponseDto;
import org.example.bitirmeprojesi.entity.Image;
import org.example.bitirmeprojesi.repository.ImageRepository;
import org.example.bitirmeprojesi.util.ImageUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    public ImageResponseDto upload(MultipartFile file) throws Exception {
        imageRepository.save(Image.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .image(ImageUtil.compressImage(file.getBytes())).build());

        return new ImageResponseDto("Image uploaded successfully: " +
                file.getOriginalFilename());
    }
    @Transactional
    public Image getInfoByImageByName(String name) {
        Optional<Image> dbImage = imageRepository.findByName(name);

        return Image.builder()
                .name(dbImage.get().getName())
                .type(dbImage.get().getType())
                .image(ImageUtil.decompressImage(dbImage.get().getImage())).build();

    }
    @Transactional
    public byte[] getImage(String name) {
        Optional<Image> dbImage = imageRepository.findByName(name);
        byte[] image = ImageUtil.decompressImage(dbImage.get().getImage());
        return image;
    }
    @Transactional
    public byte[] getImage(Long productId) {
        Optional<Image> dbImage = imageRepository.findByProductId(productId);
        byte[] image = ImageUtil.decompressImage(dbImage.get().getImage());
        return image;
    }


}
