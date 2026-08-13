# 📚 PrepMate

### AI-Powered Notes & Study Assistant

PrepMate is a full-stack study management platform that helps students create, organize, manage, and learn from their study notes with the help of AI.

It combines a secure note-management system with AI-powered study tools such as summaries, question answering, quizzes, and flashcards.

---

## 🚀 Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Automatic logout when JWT becomes invalid
- User-specific data access

### 📝 Note Management

- Create notes
- View notes
- Edit notes
- Delete notes
- Search notes
- Pagination
- Mark notes as favorite
- View note creation and update timestamps

### 📁 Categories

- Create categories
- View categories
- Update categories
- Delete categories
- Assign categories to notes

### 🏷️ Tags

- Create tags
- View tags
- Delete tags
- Assign multiple tags to notes
- Search/filter notes using organized metadata

### 🤖 AI Study Assistant

PrepMate integrates AI to turn normal notes into interactive study material.

#### 📋 AI Summary

Generate a simplified summary of a study note with:

- Short summary
- Important points
- Key terms

#### 💬 Ask AI

Ask questions about the current note.

The AI can:

- Explain concepts
- Simplify difficult topics
- Answer questions based on the note
- Compare concepts
- Provide explanations
- Make simple logical inferences from the note

#### 🧠 Practice Quiz

Generate multiple-choice questions from a note.

Each question contains:

- Question
- Multiple options
- Correct answer
- Explanation

#### 🗂️ Flashcards

Automatically generate flashcards from study notes.

Features:

- Question/answer cards
- Flip cards
- Previous/Next navigation
- Progress indicator

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router
- Axios
- CSS
- Vite

## Backend

- Java
- Spring Boot
- Spring Security
- JWT
- REST APIs
- Hibernate / JPA
- Lombok
- Jakarta Validation

## Database

- MySQL

## AI

- Google Gemini API

---

# 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      PrepMate UI     │
                    │      React + Vite    │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot API   │
                    │                      │
                    │ Controllers          │
                    │ Services             │
                    │ Security / JWT       │
                    │ Repositories         │
                    └───────┬────────┬──────┘
                            │        │
                    ┌───────▼───┐ ┌──▼────────────┐
                    │   MySQL   │ │ Google Gemini │
                    │ Database  │ │     AI API    │
                    └───────────┘ └───────────────┘

