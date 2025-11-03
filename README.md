# Gmail Bulk Sender
This web application allows users to send emails with CSV attachments using their own Gmail accounts. It supports connecting multiple Gmail accounts and selecting which one to use for sending emails.

## Features

* **Securely Connect Gmail:** Uses the OAuth 2.0 protocol to authorize the application to send emails on a user's behalf without storing their password.
* **Multi-Account Support:** Connect multiple Gmail accounts and easily switch between them.
* **Dynamic Email Composition:** Write a custom subject and body for your emails.
* **CSV Attachment:** Attach a CSV file to your emails.

## Tech Stack

* **Frontend:** React (with Vite), Axios
* **Backend:** Node.js, Express.js
* **API:** Google APIs Client Library for Node.js (Gmail API)

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

* [Node.js](https://nodejs.org/) (v14 or later)
* `npm` (comes with Node.js)
* A Google Account

### 1. Google Cloud Platform Setup

To use the Gmail API, you need to create a project in the Google Cloud Platform and get OAuth 2.0 client credentials.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Go to **APIs & Services > Enabled APIs & Services** and click **+ ENABLE APIS AND SERVICES**. Search for "Gmail API" and enable it.
4. Go to **APIs & Services > OAuth consent screen**.


<!-- TEST COMMIT - This is a test line added to verify commit author -->
