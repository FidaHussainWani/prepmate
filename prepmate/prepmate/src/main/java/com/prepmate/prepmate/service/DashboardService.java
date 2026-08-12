package com.prepmate.prepmate.service;

import com.prepmate.prepmate.dto.dashboard.StatisticsResponse;
import com.prepmate.prepmate.dto.dashboard.DashboardResponse;
import com.prepmate.prepmate.repository.AIActivityRepository;
import com.prepmate.prepmate.dto.dashboard.ActivityResponse;
import com.prepmate.prepmate.repository.NoteRepository;
import com.prepmate.prepmate.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.prepmate.prepmate.entity.AIActivity;
import com.prepmate.prepmate.entity.User;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final NoteRepository noteRepository;
    private final AIActivityRepository aiActivityRepository;

    public DashboardResponse getDashboard(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        long totalNotes =
                noteRepository.countByUser(user);

        long favoriteNotes =
                noteRepository.countByUserAndFavoriteTrue(user);

        long summaries =
                aiActivityRepository.countByUserAndType(
                        user,
                        AIActivity.ActivityType.SUMMARY
                );

        long questions =
                aiActivityRepository.countByUserAndType(
                        user,
                        AIActivity.ActivityType.QUESTION
                );

        long quizzes =
                aiActivityRepository.countByUserAndType(
                        user,
                        AIActivity.ActivityType.QUIZ
                );

        long flashcards =
                aiActivityRepository.countByUserAndType(
                        user,
                        AIActivity.ActivityType.FLASHCARDS
                );

        return new DashboardResponse(
                totalNotes,
                favoriteNotes,
                summaries,
                questions,
                quizzes,
                flashcards
        );
    }
    public List<ActivityResponse> getRecentActivities(
        String email) {

    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    return aiActivityRepository
            .findTop10ByUserOrderByCreatedAtDesc(user)
            .stream()
            .map(activity ->
                    new ActivityResponse(
                            activity.getId(),
                            activity.getNote() != null
                                    ? activity.getNote().getId()
                                    : null,
                            activity.getType(),
                            activity.getCreatedAt()
                    )
            )
            .toList();
}

public StatisticsResponse getStatistics(String email) {

    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    long totalNotes =
            noteRepository.countByUser(user);

    long favoriteNotes =
            noteRepository.countByUserAndFavoriteTrue(user);

    long notesWithCategories =
            noteRepository.countByUserAndCategoryIsNotNull(user);

    long notesWithoutCategories =
            noteRepository.countByUserAndCategoryIsNull(user);

    return new StatisticsResponse(
            totalNotes,
            favoriteNotes,
            notesWithCategories,
            notesWithoutCategories
    );
}
}