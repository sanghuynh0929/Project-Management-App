package com.thesis.projectmanagement.service;
import com.thesis.projectmanagement.model.Team;
import java.util.List;
import com.thesis.projectmanagement.dto.TeamRequest;
public interface TeamService {
    List<Team> getTeamsByProject(Long projectId);
    Team       create(Long projectId, TeamRequest req);
    Team       update(Long teamId, TeamRequest req);
    void       delete(Long teamId);
}
