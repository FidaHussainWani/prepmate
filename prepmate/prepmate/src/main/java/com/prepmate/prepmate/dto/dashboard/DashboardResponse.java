package com.prepmate.prepmate.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardResponse {

    private long totalNotes;

    private long favoriteNotes;

    private long summaries;

    private long questions;

    private long quizzes;

    private long flashcards;
}