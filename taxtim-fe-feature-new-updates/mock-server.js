import express from "express";

const app = express();
app.use(express.json());

// Simple CORS for local dev
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

let transactions = [];
const users = [];

app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});

app.post("/api/transactions/import", (req, res) => {
  const body = Array.isArray(req.body) ? req.body : [];
  transactions.push(...body);
  res.json({ success: true });
});

// Accept JSON transaction POSTs (frontend uses POST /transactions)
app.post("/api/transactions", (req, res) => {
  const body = req.body;
  if (Array.isArray(body)) {
    transactions.push(...body);
  } else if (body && typeof body === "object") {
    transactions.push(body);
  }
  console.log("Stored transactions, count:", transactions.length);
  res.json({ success: true });
});

// Simple auth endpoints for register/login
app.post("/api/register", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const exists = users.find((u) => u.email === email.toLowerCase());
  if (exists) return res.status(400).json({ message: "User already exists" });
  const user = { id: users.length + 1, email: email.toLowerCase(), password };
  users.push(user);
  return res.json({ success: true });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === (email || '').toLowerCase());
  if (!user || user.password !== password) return res.status(401).json({ message: "Invalid credentials" });
  // return a fake token
  const token = `mock-token-${user.id}`;
  return res.json({ token });
});

app.delete("/api/transactions", (req, res) => {
  transactions = [];
  res.json({ success: true });
});

app.get("/api/transactions/calculate", (req, res) => {
  // Minimal response shape expected by frontend
  res.json({ calculations: [], capitalGains: {}, baseCosts: {} });
});

// Accept POST from file uploads (frontend sends FormData)
app.post("/api/transactions/calculate", (req, res) => {
  // Accept both FormData uploads (no body parsing) and JSON bodies.
  // Return a simple mock calculation so the frontend can display results.

  // Example mock result: one tax year with a BTC profit and a calculation entry
  const mock = {
    calculations: [
      {
        id: 1,
        date: "2023-05-03",
        type: "SELL",
        sellCoin: "BTC",
        buyCoin: "ZAR",
        calculations: {
          proceeds: 100000,
          costBase: 80000,
          capitalGain: 20000,
          fifoLots: [
            { qty: 0.05, asset: "BTC", price: 1000000, date: "2020-01-01" },
          ],
        },
      },
    ],
    capitalGains: {
      2024: { BTC: 20000 },
    },
    baseCosts: {},
  };

  res.json(mock);
});

app.get("/api/reports/tax-year/:year", (req, res) => {
  res.json({});
});

const port = 8000;
app.listen(port, () => console.log(`Mock API listening on :${port}`));
