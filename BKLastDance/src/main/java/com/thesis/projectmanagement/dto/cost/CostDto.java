package com.thesis.projectmanagement.dto.cost;

import lombok.Data;

/**
 * Data-transfer object cho thực thể Cost.
 * - workItemId và epicId chỉ lưu khoá ngoại (tránh vòng lặp JSON khi trả về).
 */
@Data
public class CostDto {
    private Long   id;
    private String name;
    private Double amount;
    private String description;
    private String type;

    private Long workItemId;  // FK tới WorkItem (nullable)
    private Long epicId;      // FK tới Epic (nullable)
}
