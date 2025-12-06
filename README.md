# LARP - BASIC Simulator

This project is a web-based simulator for a simplified, fictional Bitcoin-like hashing algorithm, referred to as "LARP - BASIC". It allows users to either verify a given nonce against a set of block parameters or to start a "mining" process to find a valid nonce.

## Getting Started

### Running the Application

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd LARP-BASIC-WEB
    ```

2.  **Build the Docker image:**
    ```bash
    docker build -t larp-basic-web .
    ```

3.  **Run the Docker container:**
    ```bash
    docker run -d -p 4173:4173 larp-basic-web
    ```


## How to Use



Once the application is running in your browser:



### 1. Verify a Nonce



1.  Enter values for "Prev Block", "Tx Commit", "Time", "Target", and "Nonce" into the respective input fields.

2.  Click the "Verify Nonce" button.

3.  The "Output" panel will display:

    *   Parameters used for verification.

    *   The calculated Blockhash.

    *   A message indicating whether the Blockhash is less than or equal to the Target ("SUCCESS!") or greater than the Target ("FAILURE!").



### 2. Start Mining



1.  Enter values for "Prev Block", "Tx Commit", "Time", and "Target" into the respective input fields. (The "Nonce" field is optional for mining).

2.  Click the "Start Mining" button.

3.  The "Output" panel will update in real-time, showing:

    *   Current number of tries.

    *   The lowest hash found so far.

    *   The nonce that produced the lowest hash.

4.  If a valid nonce is found (i.e., `blockhash <= target`), the mining process will stop, and a "SUCCESS!" message will be displayed along with the winning nonce and its corresponding blockhash.

5.  You can click the "Stop Mining" button at any time to halt the process.



## Technologies Used



-   **Frontend:** Vite, TypeScript

--   **Runtime:** Node.js

-   **Hashing Library:** `crypto-js`

-   **Containerization:** Docker

-   **Package Manager:** npm
