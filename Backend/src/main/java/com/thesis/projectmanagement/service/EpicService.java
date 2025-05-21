package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.epic.EpicResponse;
import com.thesis.projectmanagement.dto.epic.EpicRequest;

import java.util.List;

public interface EpicService {
    List<EpicResponse> getAllEpics();
    EpicResponse getEpicById(Long id);
    EpicResponse createEpic(EpicRequest request);
    EpicResponse updateEpic(Long id, EpicRequest request);
    void cancelEpic(Long id);
}
