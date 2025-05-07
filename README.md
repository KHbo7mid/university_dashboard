# 🗓️ Exam Surveillance Scheduling System

![Java](https://img.shields.io/badge/Backend-Java%20%2B%20Spring%20Boot-blue)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-%2361DAFB)
![Python](https://img.shields.io/badge/AI%20Algorithm-Python%20%2B%20Flask-yellow)
![Tailwind](https://img.shields.io/badge/UI-Tailwind%20CSS-38bdf8)

A full-stack application for **automatically generating exam and surveillance schedules** in academic settings. It includes an intelligent backend, an AI-powered planner, and a modern frontend for administration and teachers.

---

## 🚀 Features

### 📅 Automated Exam Scheduling
- Supports multiple exam types:
  - `DS` – 1 hour
  - `Exam` – 1.5 hours
  - `Control` – 1.5 hours
- Automatically allocates exam sessions with date, time, and room.

### 👨‍🏫 Smart Teacher Surveillance Assignment
- Assigns teachers based on:
  - **Availability** (`UnavailableSlots`)
  - **Remaining hours** (`heures_surveillances`)
  - **Subject responsibility** (cannot surveil their own subject)
- Teachers responsible for a subject are available to assist students but receive partial credit for surveillance hours.

### 🤖 AI-Powered Scheduling
- Implemented in **Python (Flask)**
- Uses optimization logic to:
  - Avoid scheduling conflicts
  - Balance teacher workloads
  - Minimize unassigned sessions
- Integrated via REST API with the backend.

### 📩 Personalized Schedules
Each teacher receives their:
- Exam name
- Date & time
- Start and end time
- Room number

---

## 💻 Tech Stack

| Layer         | Technology                            |
|---------------|----------------------------------------|
| **Backend**   | Java, Spring Boot, JPA (Hibernate)     |
| **Frontend**  | React, TypeScript, Tailwind CSS        |
| **AI Engine** | Python, Flask                          |
| **Database**  | MySQL / PostgreSQL                     |
| **API**       | RESTful APIs                           |


---

## 📂 Project Structure
/backend --> Spring Boot application
/frontend --> React + TypeScript + Tailwind project
/server_flask --> Flask server for AI scheduling algorithm

