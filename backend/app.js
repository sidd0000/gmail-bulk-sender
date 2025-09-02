// // import express from "express";
// // import { google } from "googleapis";
// // import bodyParser from "body-parser";
// // import cors from "cors";

// // const app = express();
// // app.use(bodyParser.json({ limit: "10mb" }));
// // app.use(cors());

// // // ---------- CONFIG ----------
// // const CLIENT_ID = "REMOVED_SECRET";
// // const CLIENT_SECRET = "REMOVED_SECRET";
// // const REDIRECT_URI = "http://localhost:5000/oauth2callback";
// // const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// // // ---------- TEMP STORE ----------
// // const userTokens = {}; // store token keyed by sessionId (demo purposes)
// // const RECEIVER = "siddheshchawande7@gmail.com";
// // const SUBJECT = "Monthly TDS Report";
// // const BODY = "Please find attached your monthly TDS report.";

// // // ---------- ROUTES ----------

// // // Step 1: Generate login URL
// // app.get("/auth-url", (req, res) => {
// //   const url = oAuth2Client.generateAuthUrl({
// //     access_type: "offline",
// //     scope: ["https://www.googleapis.com/auth/gmail.send"],
// //   });
// //   res.json({ url });
// // });

// // // Step 2: OAuth callback
// // app.get("/oauth2callback", async (req, res) => {
// //   const { code } = req.query;
// //   const { tokens } = await oAuth2Client.getToken(code);
// //   const sessionId = "user123"; // demo; in production use cookies/session
// //   userTokens[sessionId] = tokens;

// //   // Redirect to frontend upload page with sessionId
// //   res.redirect(`http://localhost:5173/upload?sessionId=${sessionId}`);
// // });

// // // Step 3: Send email with uploaded CSV
// // app.post("/send", async (req, res) => {
// //   const { sessionId, csvFile } = req.body;
// //   const token = userTokens[sessionId];
// //   if (!token) return res.status(401).json({ error: "User not authenticated" });

// //   try {
// //     oAuth2Client.setCredentials(token);
// //     const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// //     const boundary = "boundary123";
// //     const messageParts = [
// //       `To: ${RECEIVER}`,
// //       `Subject: ${SUBJECT}`,
// //       "MIME-Version: 1.0",
// //       `Content-Type: multipart/mixed; boundary="${boundary}"`,
// //       "",
// //       `--${boundary}`,
// //       "Content-Type: text/plain; charset=UTF-8",
// //       "",
// //       BODY,
// //       `--${boundary}`,
// //       "Content-Type: text/csv; charset=UTF-8",
// //       "Content-Disposition: attachment; filename=report.csv",
// //       "Content-Transfer-Encoding: base64",
// //       "",
// //       csvFile,
// //       `--${boundary}--`
// //     ];

// //     const rawMessage = messageParts.join("\n");
// //     const encodedMessage = Buffer.from(rawMessage)
// //       .toString("base64")
// //       .replace(/\+/g, "-")
// //       .replace(/\//g, "_")
// //       .replace(/=+$/, "");

// //     await gmail.users.messages.send({
// //       userId: "me",
// //       requestBody: { raw: encodedMessage },
// //     });

// //     res.json({ status: "success" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ---------- START SERVER ----------
// // app.listen(5000, () => console.log("Server running on http://localhost:5000"));
// // server.js
// import express from "express";
// import { google } from "googleapis";
// import bodyParser from "body-parser";
// import cors from "cors";

// const app = express();
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(cors());

// // ---------- CONFIG ----------
// const CLIENT_ID = "REMOVED_SECRET";
// const CLIENT_SECRET = "REMOVED_SECRET";
// const REDIRECT_URI = "http://localhost:5000/oauth2callback";
// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// // ---------- TEMP STORE ----------
// const userTokens = {}; 
// // Example structure:
// // { "sessionId1": [ { email: "acc1@gmail.com", tokens: {...} }, { email: "acc2@gmail.com", tokens: {...} } ] }

// // ---------- ROUTES ----------

// // 1️⃣ Generate OAuth URL for connecting Gmail
// app.get("/auth-url", (req, res) => {
//   const { sessionId } = req.query;
//   if (!sessionId) return res.status(400).send("Missing sessionId");

//   const url = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: [
//       "https://www.googleapis.com/auth/gmail.send",
//       "https://www.googleapis.com/auth/gmail.readonly"
//     ],
//     prompt: "consent",
//     state: sessionId // Pass sessionId so callback knows which user
//   });

//   res.json({ url });
// });

// // 2️⃣ OAuth callback
// app.get("/oauth2callback", async (req, res) => {
//   const { code, state } = req.query;
//   const sessionId = state; // Retrieve sessionId from state

//   if (!sessionId) return res.status(400).send("Missing sessionId");

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     // Get Gmail address of connected account
//     const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
//     const profile = await gmail.users.getProfile({ userId: "me" });
//     const email = profile.data.emailAddress;

//     if (!userTokens[sessionId]) userTokens[sessionId] = [];
//     userTokens[sessionId].push({ email, tokens });

//     // Redirect to frontend page
//     res.redirect(`http://localhost:5173/upload?sessionId=${sessionId}`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("OAuth callback error: " + err.message);
//   }
// });

// // 3️⃣ List connected accounts
// app.get("/user-accounts", (req, res) => {
//   const { sessionId } = req.query;
//   if (!sessionId || !userTokens[sessionId]) return res.json({ accounts: [] });

//   const accounts = userTokens[sessionId].map(acc => acc.email);
//   res.json({ accounts });
// });

// // 4️⃣ Send email from selected account
// app.post("/send", async (req, res) => {
//   const { sessionId, csvFile, selectedEmail, receiver, subject, body } = req.body;

//   if (!sessionId || !userTokens[sessionId]) 
//     return res.status(401).json({ error: "No connected accounts" });

//   const account = userTokens[sessionId].find(acc => acc.email === selectedEmail);
//   if (!account) return res.status(400).json({ error: "Selected account not found" });

//   try {
//     oAuth2Client.setCredentials(account.tokens);
//     const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

//     const boundary = "boundary123";
//     const messageParts = [
//       `To: ${receiver || selectedEmail}`,
//       `Subject: ${subject || "No Subject"}`,
//       "MIME-Version: 1.0",
//       `Content-Type: multipart/mixed; boundary="${boundary}"`,
//       "",
//       `--${boundary}`,
//       "Content-Type: text/plain; charset=UTF-8",
//       "",
//       body || "Please see attached file.",
//       `--${boundary}`,
//       "Content-Type: text/csv; charset=UTF-8",
//       `Content-Disposition: attachment; filename=report.csv`,
//       "Content-Transfer-Encoding: base64",
//       "",
//       csvFile,
//       `--${boundary}--`
//     ];

//     const rawMessage = messageParts.join("\n");
//     const encodedMessage = Buffer.from(rawMessage)
//       .toString("base64")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");

//     await gmail.users.messages.send({
//       userId: "me",
//       requestBody: { raw: encodedMessage },
//     });

//     res.json({ status: "success" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- START SERVER ----------
// app.listen(5000, () => console.log("Server running on http://localhost:5000"));
import express from "express";
import { google } from "googleapis";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());

// ---------- CONFIG ----------
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// ---------- TEMP STORE ----------
const userTokens = {}; 
// Structure: { sessionId: [ { email, tokens } ] }

// ---------- ROUTES ----------

// 1️⃣ Generate OAuth URL for connecting Gmail
app.get("/auth-url", (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).send("Missing sessionId");

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly"
    ],
    prompt: "consent",
    state: sessionId
  });

  res.json({ url });
});

// 2️⃣ OAuth callback
app.get("/oauth2callback", async (req, res) => {
  const { code, state } = req.query;
  const sessionId = state;

  if (!sessionId) return res.status(400).send("Missing sessionId");

  try {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Get Gmail address
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const profile = await gmail.users.getProfile({ userId: "me" });
    const email = profile.data.emailAddress;

    if (!userTokens[sessionId]) userTokens[sessionId] = [];
    userTokens[sessionId].push({ email, tokens });

    // Redirect to frontend page
    res.redirect(`http://localhost:5173/upload?sessionId=${sessionId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth callback error: " + err.message);
  }
});

// 3️⃣ List connected accounts
app.get("/user-accounts", (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || !userTokens[sessionId]) return res.json({ accounts: [] });

  const accounts = userTokens[sessionId].map(acc => acc.email);
  res.json({ accounts });
});

// 4️⃣ Send email from selected account
app.post("/send", async (req, res) => {
  const { sessionId, csvFile, selectedEmail, receiver, subject, body } = req.body;

  if (!sessionId || !userTokens[sessionId])
    return res.status(401).json({ error: "No connected accounts" });

  const account = userTokens[sessionId].find(acc => acc.email === selectedEmail);
  if (!account) return res.status(400).json({ error: "Selected account not found" });

  try {
    const client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    client.setCredentials(account.tokens);

    const gmail = google.gmail({ version: "v1", auth: client });

    const boundary = "boundary123";
    const messageParts = [
      `To: ${receiver || selectedEmail}`,
      `Subject: ${subject || "No Subject"}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      body || "Please see attached file.",
      `--${boundary}`,
      "Content-Type: text/csv; charset=UTF-8",
      `Content-Disposition: attachment; filename=report.csv`,
      "Content-Transfer-Encoding: base64",
      "",
      csvFile,
      `--${boundary}--`
    ];

    const rawMessage = messageParts.join("\n");
    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- START SERVER ----------
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
