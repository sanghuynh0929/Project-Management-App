package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.epic.EpicResponse;
import com.thesis.projectmanagement.dto.epic.EpicRequest;

import java.util.List;

public interface EpicService {
    List<EpicResponse> getAllEpics();
    List<EpicResponse> getEpicsByProjectId(Long projectId);
    List<String> getDependencyTitles(Long epicId);
    EpicResponse getEpicById(Long id);
    EpicResponse createEpic(EpicRequest request);
    EpicResponse updateEpic(Long id, EpicRequest request);
    void cancelEpic(Long id);
}
