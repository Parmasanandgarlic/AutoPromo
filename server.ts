import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { db } from "./src/agent/db.js";
import { sessionManager } from "./src/agent/sessionManager.js";
import { listener } from "./src/agent/listener.js";
import { scraper } from "./src/agent/scraper.js";
import { operator } from "./src/agent/operator.js";
import { engagement } from "./src/agent/engagement.js";
import { twitterAutomation } from "./src/agent/twitter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Sessions API
  app.get("/api/sessions", async (req, res) => {
    const sessions = await db.getSessions();
    res.json(sessions);
  });

  app.post("/api/sessions", async (req, res) => {
    const { name, apiId, apiHash, phoneNumber } = req.body;
    try {
      const session = await sessionManager.createSession(name, apiId, apiHash, phoneNumber);
      res.json(session);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/sessions/:id/verify", async (req, res) => {
    const { id } = req.params;
    const { phoneCode, password } = req.body;
    try {
      const session = await sessionManager.verifySession(Number(id), phoneCode, password);
      res.json(session);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await sessionManager.deleteSession(Number(id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Keywords API
  app.get("/api/keywords", async (req, res) => {
    const keywords = await db.getKeywords();
    res.json(keywords);
  });

  app.post("/api/keywords", async (req, res) => {
    const { keyword } = req.body;
    try {
      await db.addKeyword(keyword);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/keywords/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.deleteKeyword(Number(id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Groups API
  app.get("/api/groups", async (req, res) => {
    const groups = await db.getGroups();
    res.json(groups);
  });

  app.post("/api/groups", async (req, res) => {
    const { groupId, name } = req.body;
    try {
      await db.addGroup(groupId, name);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/groups/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.deleteGroup(Number(id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Scraped Users API
  app.get("/api/users", async (req, res) => {
    const users = await db.getScrapedUsers();
    res.json(users);
  });

  // Logs API
  app.get("/api/logs", async (req, res) => {
    const logs = await db.getLogs();
    res.json(logs);
  });

  // Actions API
  app.post("/api/actions/scrape", async (req, res) => {
    const { sessionId, groupId } = req.body;
    try {
      await scraper.scrapeGroup(sessionId, groupId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/actions/start-listener", async (req, res) => {
    const { sessionId } = req.body;
    try {
      await listener.start(sessionId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/actions/stop-listener", async (req, res) => {
    try {
      await listener.stop();
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/actions/start-operator", async (req, res) => {
    const { sessionId, template, maxPerDay } = req.body;
    try {
      await operator.start(sessionId, template, maxPerDay);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/actions/stop-operator", async (req, res) => {
    try {
      await operator.stop();
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/actions/engage", async (req, res) => {
    const { sessionId, target, action, emoji } = req.body;
    try {
      await engagement.engage(sessionId, target, action, emoji);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/twitter/action", async (req, res) => {
    const { account, target, action, content } = req.body;
    try {
      const accounts = await db.getTwitterAccounts();
      const accountData = accounts.find(a => a.name === account);
      if (!accountData) {
        throw new Error(`Twitter account ${account} not found in database.`);
      }

      const result = await twitterAutomation.executeAction(
        account, 
        target, 
        action, 
        { authToken: accountData.auth_token, ct0: accountData.ct0 },
        content
      );
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/twitter/status/:account", async (req, res) => {
    const { account } = req.params;
    try {
      const status = twitterAutomation.getAccountStatus(account);
      res.json(status);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Twitter Accounts API
  app.get("/api/twitter/accounts", async (req, res) => {
    const accounts = await db.getTwitterAccounts();
    // Don't send sensitive tokens to frontend in list
    res.json(accounts.map(a => ({ id: a.id, name: a.name, status: a.status, created_at: a.created_at })));
  });

  app.post("/api/twitter/accounts", async (req, res) => {
    const { name, authToken, ct0 } = req.body;
    try {
      const account = await db.addTwitterAccount(name, authToken, ct0);
      res.json(account);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/twitter/accounts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.deleteTwitterAccount(Number(id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Initialize DB and start server
  await db.init();
  
  // Auto-start active sessions
  await sessionManager.init();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
