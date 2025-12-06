# LARP - BASIC Simulator

This project is a web-based simulator for a simplified, fictional Bitcoin-like hashing algorithm, referred to as "LARP - BASIC". It allows users to either verify a given nonce against a set of block parameters or to start a "mining" process to find a valid nonce.

The application is built using TypeScript and Vite, with a custom hashing implementation using `crypto-js` (specifically RIPEMD-160). The entire application is containerized with Docker for easy setup and deployment.

## Features

-   **Nonce Verification**: Input block parameters and a nonce to calculate and verify the resulting hash.
-   **Mining Simulation**: Start an automated process to iterate through nonces to find a hash that meets the target difficulty.
-   **Real-time Output**: Displays the ongoing status of the mining process, including tries, the current best hash, and the best nonce found.
-   **Containerized**: Runs in a Docker container for a consistent and easy-to-manage setup.

## Getting Started

### Prerequisites

-   Docker Desktop (or Docker Engine) must be installed and running.
-   A web browser.
-   `git` for cloning the repository.

### Running the Application

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd LARP-BASIC-WEB
    ```

2.  **Build the Docker image:**
    This command builds the multi-stage Docker image, which includes installing dependencies, compiling the TypeScript code, and setting up the production server. The image will be tagged as `larp-basic-web`.
    ```bash
    docker build -t larp-basic-web .
    ```

3.  **Run the Docker container:**
    This command starts the application in a detached Docker container and maps port `4173` from the container to your host machine.
    ```bash
    docker run -d -p 4173:4173 larp-basic-web
    ```

4.  **Access the application:**
    Open your web browser and navigate to:
    **[http://localhost:4173](http://localhost:4173)**

5.  **Stop the Docker container:**
    To stop the running container, find its ID using `docker ps` and then use the `docker stop` command.
    ```bash
    # Find the container ID
    docker ps

    # Stop the container
    docker stop <container-id>
    ```

## Project Structure

```
.
├── docker-compose.yml
├── Dockerfile
├── index.html
├── package.json
├── README.md
├── src
│   ├── hashing.ts
│   ├── main.ts
│   └── style.css
├── tsconfig.json
└── vite.config.ts
```

### Key Files

-   `Dockerfile`: Defines the multi-stage build and production environment for the container.
-   `index.html`: The main entry point for the web application.
-   `src/main.ts`: Handles the UI logic, user interactions (mining/verifying), and DOM manipulation.
-   `src/hashing.ts`: Contains the core `calculate_result` function which implements the custom RIPEMD-160 based hashing algorithm.
-   `src/style.css`: Provides the styling for the application, giving it a retro, terminal-like feel.

## Available `npm` Scripts

These scripts are defined in `package.json` and are used within the `Dockerfile` for building and running the application.

-   `dev`: Runs the Vite development server (not used in the Docker container).
-   `build`: Compiles the TypeScript code and builds the production-ready assets into the `dist` folder.
-   `preview`: Starts a local web server to preview the built assets. The `--host` flag is used in the container to make it accessible.

## Technologies Used

-   **Frontend:** Vite, TypeScript
--   **Runtime:** Node.js
-   **Hashing Library:** `crypto-js`
-   **Containerization:** Docker
-   **Package Manager:** npm