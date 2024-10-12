# Project Title: Gym Management System

## Live Demo

You can access the live version of the project here: [Live Link](https://gym-management-ecru.vercel.app/)

## Entity-Relationship (ER) Diagram

Here is the ER diagram of the project to help visualize the database structure.

![ER Diagram](./uploads/images/er-diagram.png)

## Installation and Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Nasir1290/gym-server.git
    ```

**Create a `.env` file:**

In the root directory of the project, create a `.env` file and add the following variables. Adjust the values according to your setup.

```env
# Basic
JWT_ACCESS_TOKEN_SECRET=jwt_secret
JWT_REFRESH_TOKEN_SECRET=jwt_secret_refresh_token
JWT_SECRET=jwt_secret
JWT_ACCESS_TOKEN_EXPIRED_IN=7d
JWT_REFRESH_TOKEN_EXPIRED_IN = 30d
JWT_RESET_TOKEN_EXPIRED_IN = 1h
```

## Features

-   **Authentication API:** Complete authentication system using JWT for secure token-based authentication and bcrypt for password hashing.
-   **File Upload:** Implemented using Multer with efficient file handling and short-term storage.
-   **Data Validation:** Robust data validation using Zod and Mongoose s
-   **Logging:** Logging with Winston and file rotation using DailyRotateFile.
-   **API Request Logging:** Logging API requests using Morgan.

## Tech Stack

-   Typescript
-   Node.js
-   Express
-   Mongoose
-   Bcrypt
-   JWT
-   NodeMailer
-   Multer
-   ESLint
-   Prettier
-   Winston
-   Daily-winston-rotate-file
-   Morgen
-   Socket

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

-   Node.js
-   npm or yarn

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/your-repository.git
    cd your-repository
    ```

2. **Install dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Using yarn:

    ```bash
    yarn install
    ```

3. **Run the project:**

    Using npm:

    ```bash
    npm run dev
    ```

    Using yarn:

    ```bash
    yarn run dev
    ```

### Running the Tests

Explain how to run the automated tests for this system.

```bash
npm test
```

---

Made with ❤️ by [Nasir Mollah](https://nasirmollah.vercel.app)
