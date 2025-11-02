# Gmail Bulk Sender

This web application allows users to send emails with CSV attachments using their own Gmail accounts. It supports connecting multiple Gmail accounts and selecting which one to use for sending emails.

## Features

*   **Securely Connect Gmail:** Uses the OAuth 2.0 protocol to authorize the application to send emails on a user's behalf without storing their password.
*   **Multi-Account Support:** Connect multiple Gmail accounts and easily switch between them.
*   **Dynamic Email Composition:** Write a custom subject and body for your emails.
*   **CSV Attachment:** Attach a CSV file to your emails.

## Tech Stack

*   **Frontend:** React (with Vite), Axios
*   **Backend:** Node.js, Express.js
*   **API:** Google APIs Client Library for Node.js (Gmail API)

## Project Structure

```
/
├── backend/        # Node.js Express backend
│   ├── app.js      # Main server file
│   └── package.json
├── frontend/       # React frontend
│   ├── src/
│   │   └── App.jsx # Main application component
│   └── package.json
└── README.md
```

## Setup and Installation

### Prerequisites

*   [Node.js](https://nodejs.org/) (v14 or later)
*   `npm` (comes with Node.js)
*   A Google Account

### 1. Google Cloud Platform Setup

To use the Gmail API, you need to create a project in the Google Cloud Platform and get OAuth 2.0 client credentials.

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project.
3.  Go to **APIs & Services > Enabled APIs & Services** and click **+ ENABLE APIS AND SERVICES**. Search for "Gmail API" and enable it.
4.  Go to **APIs & Services > OAuth consent screen**.
    *   Choose **External** and create an app. Give it a name and provide your user support email.
    *   You don't need to add scopes here.
    *   Add your email address as a test user.
5.  Go to **APIs & Services > Credentials**.
    *   Click **+ CREATE CREDENTIALS** and choose **OAuth client ID**.
    *   Select **Web application** for the application type.
    *   Under **Authorized redirect URIs**, add the URI for the backend callback. For this project's default setup, it is `http://localhost:5000/oauth2callback`.
    *   Click **Create**. You will be shown your **Client ID** and **Client Secret**. Copy these.

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create an environment file
touch .env
```

Open the `.env` file and add the following variables, replacing the placeholder values with your credentials from the Google Cloud Console:

```
CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
REDIRECT_URI=http://localhost:5000/oauth2callback
PORT=5000
```

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create an environment file
touch .env
```

Open the `.env` file and add the URL of your backend server:

```
VITE_BACKEND_URL=http://localhost:5000
```

## Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    node app.js
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the frontend application:**
    ```bash
    # In a new terminal
    cd frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

Open your browser to the frontend URL to use the application.
