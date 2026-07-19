# 🤖 AI Prompts & Chat History

This file documents the AI prompts, contexts, and significant interactions used during the development of this project. 

---

## 📅 [2026-07-18] — Project Setup & Architecture

### 🛠️ Global System Context
> **Tech Stack:** Node.js/TypeScript (with Express), MongoDB
> **Project Goal:** Backend of a car dealership inventory management system.

### 👤 Prompt 1: Project Initialization
```text
hi i'm developing the backend of car dealership inventory management using node express typescript mongo. I;m using tdd approach. Help me build the base backend project structure for my system.
```
## 📅 [2026-07-19] — Development Following TDD Approach

### 🛠️Global Development Context
> **Tech Stack:** Node.js/TypeScript (with Express), MongoDB, Jest
> **Project Goal:** Backend of a car dealership inventory management system.

### 👤 Prompt 1: Writing User Registration Test Cases
```text
Hi.

I'm developing the backend of a car dealership inventory management system.

I'm strictly following a TDD approach.

My technology stack:
- Node.js
- Express
- TypeScript
- MongoDB
- Zod
- Jest

Help me write unit test cases incrementally for user registration.

Follow strict TDD principles.

The UserRegistrationService should cover:
- successful user registration
- duplicate email rejection
- password hashing before saving
- passing hashed password to repository
- propagating hashing errors
- propagating repository errors
- assigning default role: "user"

Do not implement the service yet.
Focus only on writing appropriate unit tests.
```
### 👤 Prompt 2: Refining Unit Test Scope
```text
Don't use Zod validation inside unit tests.

Give me unit tests only for UserRegistrationService.

The tests should verify the following business behaviors:

- UserRegistrationService registers user successfully
- Rejects duplicate email
- Hashes password before saving
- Passes hashed password to repository
- Propagates password hashing errors
- Propagates repository errors
- Assigns default role: "user"

Mock external dependencies such as:
- User repository
- Password hashing service

Follow strict TDD principles.
```
### 👤 Prompt 3: Writing minimal code to pass test case
```text
As we have written the test, now help me write the minimal code to pass this test case (green of tdd)

Follow strict TDD principles.
```
### 👤 Prompt 4: Refactoring the registration code
```text
As we have written the minimal code to pass test, now help me refactor the code

Follow strict TDD principles.
```


