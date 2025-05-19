package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.constants.enums.EpicStatus;
import com.thesis.projectmanagement.dto.EpicDto;
import com.thesis.projectmanagement.dto.EpicRequest;
import com.thesis.projectmanagement.mapper.EpicMapper;
import com.thesis.projectmanagement.model.Epic;
import com.thesis.projectmanagement.repository.EpicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EpicService {

    private final EpicRepository epicRepository;

    public List<EpicDto> getAllEpics() {
        return epicRepository.findAll()
                .stream()
                .map(EpicMapper::toDto)
                .toList();
    }

    public EpicDto getEpicById(Long id) {
        Epic epic = epicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epic not found"));
        return EpicMapper.toDto(epic);
    }

    public EpicDto createEpic(EpicRequest request) {
        Epic epic = EpicMapper.fromRequest(request);
        return EpicMapper.toDto(epicRepository.save(epic));
    }

    public EpicDto updateEpic(Long id, EpicRequest request) {
        Epic epic = epicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epic not found"));

        epic.setTitle(request.getTitle());
        epic.setDescription(request.getDescription());
        epic.setStartDate(request.getStartDate());
        epic.setEndDate(request.getEndDate());
        epic.setStatus(request.getStatus());

        return EpicMapper.toDto(epicRepository.save(epic));
    }

    public void cancelEpic(Long id) {
        Epic epic = epicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epic not found"));
        epic.setStatus(EpicStatus.valueOf("CANCELED"));
        epicRepository.save(epic);
    }
}
