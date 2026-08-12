package com.prepmate.prepmate.controller;

import com.prepmate.prepmate.dto.dashboard.DashboardResponse;
import com.prepmate.prepmate.dto.dashboard.StatisticsResponse;
import com.prepmate.prepmate.service.DashboardService;
import org.springframework.security.core.Authentication;
import com.prepmate.prepmate.dto.dashboard.ActivityResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(
            Authentication authentication) {

        return dashboardService.getDashboard(
                authentication.getName()
        );
    }
    @GetMapping("/activity")
    public List<ActivityResponse> getRecentActivities(
            Authentication authentication) {

        return dashboardService.getRecentActivities(
                authentication.getName()
        );
    }
    @GetMapping("/statistics")
    public StatisticsResponse getStatistics(
            Authentication authentication) {

        return dashboardService.getStatistics(
                authentication.getName()
        );
    }
}