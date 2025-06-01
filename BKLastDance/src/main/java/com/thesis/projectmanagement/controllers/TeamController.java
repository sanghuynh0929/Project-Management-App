package com.thesis.projectmanagement.controllers;
import com.thesis.projectmanagement.dto.TeamDto;
import com.thesis.projectmanagement.dto.TeamRequest;
import com.thesis.projectmanagement.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects/{projectId}/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    public List<TeamDto> list(@PathVariable Long projectId) {
        return teamService.getTeamsByProject(projectId)
                .stream().map(TeamDto::fromEntity).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeamDto create(@PathVariable Long projectId,
                          @RequestBody @Valid TeamRequest req) {
        return TeamDto.fromEntity(teamService.create(projectId, req));
    }

    @PutMapping("/{teamId}")
    public TeamDto update(@PathVariable Long teamId,
                          @RequestBody @Valid TeamRequest req) {
        return TeamDto.fromEntity(teamService.update(teamId, req));
    }

    @DeleteMapping("/{teamId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long teamId) {
        teamService.delete(teamId);
    }
}
