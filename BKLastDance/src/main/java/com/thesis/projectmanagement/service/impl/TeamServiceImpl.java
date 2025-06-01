package com.thesis.projectmanagement.service.impl;
import com.thesis.projectmanagement.exception.ResourceNotFoundException;
import com.thesis.projectmanagement.model.Team;
import com.thesis.projectmanagement.repository.TeamRepository;
import com.thesis.projectmanagement.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.thesis.projectmanagement.dto.TeamRequest;
import com.thesis.projectmanagement.model.Project;
import com.thesis.projectmanagement.repository.ProjectRepository;

import java.util.List;


@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepo;
    private final ProjectRepository projectRepo;   // bạn đã có sẵn

    @Override
    public List<Team> getTeamsByProject(Long projectId) {
        return teamRepo.findByProjectId(projectId);
    }
    @Override
    public Team create(Long projectId, TeamRequest req) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));

        Team team = new Team();
        team.setName(req.name());
        team.setDescription(req.description());
        team.setProject(project);
        return teamRepo.save(team);
    }

    @Override
    public Team update(Long teamId, TeamRequest req) {
        Team team = teamRepo.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", teamId));
        team.setName(req.name());
        team.setDescription(req.description());
        return teamRepo.save(team);
    }

    @Override
    public void delete(Long teamId) {
        teamRepo.deleteById(teamId);
    }
}
