package com.prepmate.prepmate.dto.dashboard;

import com.prepmate.prepmate.entity.AIActivity;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ActivityResponse {

    private Long id;

    private Long noteId;

    private AIActivity.ActivityType type;

    private LocalDateTime createdAt;
}