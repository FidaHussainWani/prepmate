package com.prepmate.prepmate.dto.ai;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class QuizQuestion {

    private String question;

    private List<String> options;

    private String correctAnswer;

    private String explanation;
}