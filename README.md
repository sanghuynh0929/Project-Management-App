# Agile Project Management System

This is a full-stack Agile project management system backend built with **Spring Boot**, utilizing **JPA/Hibernate** for ORM and automatic database schema generation. It supports key concepts in Agile workflows such as **Projects**, **Sprints**, **Epics**, **Work Items**, and associated **Personnel** and **Costs**.

## Features

- Create and manage multiple projects
- Define epics and break them down into work items
- Organize work items into sprints with execution and review cycle
- Assign personnel and allocate costs to specific items or sprints
- Automatically generate relational database schema from JPA models
- RESTful APIs for integration with a frontend (React)

## Entities & Relationships

### Entities

- `Project`: Represents a project lifecycle
- `Sprint`: A time-boxed development cycle
- `Epic`: A high-level feature or goal
- `WorkItem`: A task or requirement (story, bug, etc.)
- `Person`: Team member
- `Cost`: Expense item (personnel, material, etc.)

## Tech Stack

- **Backend**: Spring Boot, Spring Data JPA, Hibernate
- **Database**: H2 (Dev) / MySQL
- **ORM**: JPA with Hibernate
- **Build Tool**: Maven / Gradle

## Getting Started

### Prerequisites

- Java 17+
- Maven or Gradle
- IDE (e.g. IntelliJ IDEA, VSCode)

### Running the Project

```bash
# Clone the repo
git clone https://github.com/sanghuynh0929/Project-Management-App.git
cd Project-Management-App
```

First, run the backend server on port 8080. Then, start the frontend (a React app) on another port such as 8081 to communicate with the backend via REST API endpoints.
