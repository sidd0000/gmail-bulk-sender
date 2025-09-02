// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [sessionId] = useState("testuser123");
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [receiver, setReceiver] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");

//   const fetchAccounts = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/user-accounts?sessionId=${sessionId}`);
//       setAccounts(res.data.accounts);
//       // ✅ Only set selected account if it's empty
//       if (!selectedAccount && res.data.accounts.length > 0) {
//         setSelectedAccount(res.data.accounts[0]);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//     const interval = setInterval(fetchAccounts, 3000);
//     return () => clearInterval(interval);
//   }, [selectedAccount]);

//   const connectGmail = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/auth-url?sessionId=${sessionId}`);
//       window.open(res.data.url, "_blank");
//     } catch (err) {
//       alert("Failed to get auth URL: " + err.message);
//     }
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = () => setCsvFile(btoa(reader.result));
//     reader.readAsText(file);
//   };

//   const sendEmail = async () => {
//     if (!csvFile) return alert("Select CSV file");
//     if (!selectedAccount) return alert("Select Gmail account");

//     try {
//       await axios.post("http://localhost:5000/send", {
//         sessionId,
//         selectedEmail: selectedAccount,
//         receiver,
//         subject,
//         body,
//         csvFile,
//       });
//       alert("Email sent successfully!");
//     } catch (err) {
//       alert("Error: " + err.response?.data?.error || err.message);
//     }
//   };

//   return (
//     <div className="app-container">
//       <h2>Multi Gmail Email Sender</h2>
//       <button className="connect-btn" onClick={connectGmail}>
//         Connect Gmail Account
//       </button>

//       <div className="input-group">
//         <label>Select Account:</label>
//         <select
//           value={selectedAccount}
//           onChange={(e) => setSelectedAccount(e.target.value)}
//         >
//           {accounts.map((acc) => (
//             <option key={acc} value={acc}>{acc}</option>
//           ))}
//         </select>
//       </div>

//       <div className="input-group">
//         <input type="text" placeholder="Receiver Email" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
//       </div>

//       <div className="input-group">
//         <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
//       </div>

//       <div className="input-group">
//         <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
//       </div>

//       <div className="input-group">
//         <input type="file" accept=".csv" onChange={handleFile} />
//       </div>

//       <button className="send-btn" onClick={sendEmail}>Send Email</button>
//     </div>
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [sessionId] = useState("testuser123");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // ✅ Use backend URL from environment
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user-accounts?sessionId=${sessionId}`);
      setAccounts(res.data.accounts);

      // Set default selected account if none
      if (!selectedAccount && res.data.accounts.length > 0) {
        setSelectedAccount(res.data.accounts[0]);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
    const interval = setInterval(fetchAccounts, 3000);
    return () => clearInterval(interval);
  }, [selectedAccount]);

  const connectGmail = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth-url?sessionId=${sessionId}`);
      // Open OAuth URL in new tab
      window.open(res.data.url, "_blank");
    } catch (err) {
      alert("Failed to get auth URL: " + err.message);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCsvFile(btoa(reader.result)); // base64 encode
    };
    reader.readAsText(file);
  };

  const sendEmail = async () => {
    if (!csvFile) return alert("Select a CSV file.");
    if (!selectedAccount) return alert("Select a Gmail account.");

    try {
      await axios.post(`${BACKEND_URL}/send`, {
        sessionId,
        selectedEmail: selectedAccount,
        receiver,
        subject,
        body,
        csvFile,
      });
      alert("Email sent successfully!");
      // Clear inputs after sending
      setReceiver("");
      setSubject("");
      setBody("");
      setCsvFile(null);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="app-container">
      <h2>Multi Gmail Email Sender</h2>

      <button className="connect-btn" onClick={connectGmail}>
        Connect Gmail Account
      </button>

      <div className="input-group">
        <label>Select Account:</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          {accounts.map((acc) => (
            <option key={acc} value={acc}>
              {acc}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Receiver Email"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="input-group">
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input type="file" accept=".csv" onChange={handleFile} />
      </div>

      <button className="send-btn" onClick={sendEmail}>
        Send Email
      </button>
    </div>
  );
}

export default App;
