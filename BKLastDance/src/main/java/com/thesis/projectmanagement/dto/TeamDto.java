package com.thesis.projectmanagement.dto;

import com.thesis.projectmanagement.model.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho Team – có thêm trường projectId.
 */
@Data                     // sinh getter, setter, equals, hashCode, toString
@Builder                  // TeamDto.builder()...
@AllArgsConstructor       // constructor đầy đủ tham số
@NoArgsConstructor        // constructor rỗng (cần cho Jackson)
public class TeamDto {

    private Long id;
    private String name;
    private String description;
    private Long projectId;

    /**
     * Chuyển từ entity sang DTO.
     */
    public static TeamDto fromEntity(Team t) {
        if (t == null) return null;
        return TeamDto.builder()
                .id(t.getId())
                .name(t.getName())
                .description(t.getDescription())
                .projectId(t.getProject() != null ? t.getProject().getId() : null)
                .build();
    }
}
