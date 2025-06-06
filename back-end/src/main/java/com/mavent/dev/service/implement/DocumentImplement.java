package com.mavent.dev.service.implement;

import com.mavent.dev.DTO.ImageDTO;
import com.mavent.dev.config.CloudConfig;
import com.mavent.dev.entity.Document;
import com.mavent.dev.repository.DocumentRepository;
import com.mavent.dev.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentImplement implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Override
    public List<ImageDTO> getFiveImage() {
        List<Document> images = documentRepository.findTop5ByOrderByCreatedAtDesc();
        CloudConfig cloud = new CloudConfig();
        List<ImageDTO> imageFiles = new ArrayList<>();
        for(Document image : images){
            try {
                imageFiles.add(new ImageDTO( cloud.getFileBytes(image.getFilePath()),image.getFileType()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return imageFiles;
    }
}
