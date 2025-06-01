package com.thesis.projectmanagement.mapper;
import com.thesis.projectmanagement.dto.TeamDto;
import com.thesis.projectmanagement.model.Team;
import com.thesis.projectmanagement.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
public class TeamMapper {

    private final ProjectRepository projectRepo;

    public TeamDto toDto(Team entity) {
        if (entity == null) return null;

        TeamDto dto = new TeamDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setProjectId(entity.getProject() != null ? entity.getProject().getId() : null);
        return dto;
    }

    public Team toEntity(TeamDto dto) {
        if (dto == null) return null;

        Team team = new Team();
        team.setId(dto.getId());
        team.setName(dto.getName());
        team.setDescription(dto.getDescription());

        if (dto.getProjectId() != null) {
            team.setProject(projectRepo.getReferenceById(dto.getProjectId()));
        }
        return team;
    }
}