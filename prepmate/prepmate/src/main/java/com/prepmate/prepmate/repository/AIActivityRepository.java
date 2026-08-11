package com.prepmate.prepmate.repository;

import com.prepmate.prepmate.entity.AIActivity;
import com.prepmate.prepmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AIActivityRepository
        extends JpaRepository<AIActivity, Long> {

    List<AIActivity> findByUserOrderByCreatedAtDesc(
            User user
    );

    long countByUserAndType(
            User user,
            AIActivity.ActivityType type
    );
}