package com.prepmate.prepmate.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatisticsResponse {

    private long totalNotes;
    private long favoriteNotes;
    private long notesWithCategories;
    private long notesWithoutCategories;
}