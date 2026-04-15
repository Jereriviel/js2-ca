# Cross Course Project: Hearth Social Media App

![image](https://jereriviel.github.io/portfolio/assets/img/thumbnail_hearth.webp)

## Description

This project was originally developed as part of the JavaScript 2 Course Assignment, where the task was to build a front-end user interface for a social media application using Noroff's API. Since then the project has been expanded with new features and improvements through the Workflow and CSS Frameworks courses.

The application allows users to perform CRUD operations on their profiles and posts, as well as interact through features such as following/unfollowing users, commenting on posts, and searching for posts and profiles.

To ensure code quality and maintainability, tools like ESLint and Playwright have been integrated into the workflow to streamline development and testing.

The front-end is built with the Tailwind CSS Framework, providing a responsive and accessible interface designed with UI and UX best practices in mind.

## Tech stack

- HTML
- Vanilla TypeScript
- Tailwind CSS
- Vite
- Vitest
- Playwright

## Installing

1. Clone the repo:

```bash
git clone https://github.com/Jereriviel/js2-ca.git
```

2. Install dependencies

```bash
npm install
```

3. Start the local dev server:

```bash
npm run dev
```

4. Build the project

```bash
npm run build
```

## Running Tests

### Unit Tests with Vitest

Run the Vite unit tests using:

```bash
npm run test:unit
```

### End-to-End Tests with Playwright

Run the Playwright E2E tests using:

```bash
npm run test:e2e
```

### Environment Variables

Create an .env file in the root of the project and copy these variables from the .env.example file:

```bash
TEST_USER_EMAIL
TEST_USER_PASSWORD
VITE_API_KEY
VITE_API_BASE
```

## Linting and Formatting

Run Prettier:

```bash
npm run format
```

Run ESLint:

```bash
npm run lint
```

## Pre-Commit Hooks with Husky

Husky is configured to automatically check linting and formatting before each commit:

```bash
npm run prepare
```

## Deployment

This site is deployed using Netlify: https://jereriviel-js2-ca.netlify.app/

## Contact

If you have any questions or feedback, feel free to contact me on [LinkedIn](www.linkedin.com/in/carina-mariell-pedersen-2a8648403).
