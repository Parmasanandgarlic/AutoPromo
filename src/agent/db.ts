import fs from 'fs/promises';
import path from 'path';

interface Session {
  id: number;
  name: string;
  api_id: number;
  api_hash: string;
  phone_number: string;
  session_string?: string;
  status: string;
  created_at: string;
}

interface Keyword {
  id: number;
  keyword: string;
}

interface Group {
  id: number;
  group_id: string;
  name: string;
}

interface ScrapedUser {
  id: number;
  user_id: string;
  username: string | null;
  last_seen: string | null;
  source_group: string;
  contacted: boolean;
  contacted_at: string | null;
  created_at: string;
}

interface Log {
  id: number;
  type: string;
  message: string;
  data: string | null;
  created_at: string;
}

interface DBSchema {
  sessions: Session[];
  keywords: Keyword[];
  groups: Group[];
  scraped_users: ScrapedUser[];
  logs: Log[];
}

class DB {
  private dbPath = process.env.USER_DATA_PATH 
    ? path.join(process.env.USER_DATA_PATH, 'agent_db.json')
    : path.join(process.cwd(), 'agent_db.json');
  private data: DBSchema = {
    sessions: [],
    keywords: [],
    groups: [],
    scraped_users: [],
    logs: []
  };

  async init() {
    try {
      const fileData = await fs.readFile(this.dbPath, 'utf-8');
      this.data = JSON.parse(fileData);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        await this.save();
      } else {
        console.error('Failed to load DB:', e);
      }
    }
  }

  private async save() {
    await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
  }

  private generateId(collection: any[]): number {
    return collection.length > 0 ? Math.max(...collection.map(i => i.id)) + 1 : 1;
  }

  // Sessions
  async getSessions() {
    return this.data.sessions;
  }

  async getSession(id: number) {
    return this.data.sessions.find(s => s.id === id);
  }

  async addSession(name: string, apiId: number, apiHash: string, phoneNumber: string) {
    const session: Session = {
      id: this.generateId(this.data.sessions),
      name,
      api_id: apiId,
      api_hash: apiHash,
      phone_number: phoneNumber,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    this.data.sessions.push(session);
    await this.save();
    return session;
  }

  async updateSessionString(id: number, sessionString: string, status: string = 'active') {
    const session = this.data.sessions.find(s => s.id === id);
    if (session) {
      session.session_string = sessionString;
      session.status = status;
      await this.save();
    }
  }

  async deleteSession(id: number) {
    this.data.sessions = this.data.sessions.filter(s => s.id !== id);
    await this.save();
  }

  // Keywords
  async getKeywords() {
    return this.data.keywords;
  }

  async addKeyword(keyword: string) {
    if (!this.data.keywords.find(k => k.keyword === keyword)) {
      this.data.keywords.push({
        id: this.generateId(this.data.keywords),
        keyword
      });
      await this.save();
    }
  }

  async deleteKeyword(id: number) {
    this.data.keywords = this.data.keywords.filter(k => k.id !== id);
    await this.save();
  }

  // Groups
  async getGroups() {
    return this.data.groups;
  }

  async addGroup(groupId: string, name: string) {
    if (!this.data.groups.find(g => g.group_id === groupId)) {
      this.data.groups.push({
        id: this.generateId(this.data.groups),
        group_id: groupId,
        name
      });
      await this.save();
    }
  }

  async deleteGroup(id: number) {
    this.data.groups = this.data.groups.filter(g => g.id !== id);
    await this.save();
  }

  // Scraped Users
  async getScrapedUsers() {
    return [...this.data.scraped_users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 1000);
  }

  async addScrapedUser(userId: string, username: string | null, lastSeen: Date | null, sourceGroup: string) {
    if (!this.data.scraped_users.find(u => u.user_id === userId)) {
      this.data.scraped_users.push({
        id: this.generateId(this.data.scraped_users),
        user_id: userId,
        username,
        last_seen: lastSeen ? lastSeen.toISOString() : null,
        source_group: sourceGroup,
        contacted: false,
        contacted_at: null,
        created_at: new Date().toISOString()
      });
      await this.save();
    }
  }

  async markUserContacted(userId: string) {
    const user = this.data.scraped_users.find(u => u.user_id === userId);
    if (user) {
      user.contacted = true;
      user.contacted_at = new Date().toISOString();
      await this.save();
    }
  }

  async getUncontactedUsers(limit: number = 10) {
    return this.data.scraped_users
      .filter(u => !u.contacted)
      .sort((a, b) => {
        const timeA = a.last_seen ? new Date(a.last_seen).getTime() : 0;
        const timeB = b.last_seen ? new Date(b.last_seen).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, limit);
  }

  // Logs
  async getLogs() {
    return [...this.data.logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 500);
  }

  async addLog(type: string, message: string, data?: any) {
    this.data.logs.push({
      id: this.generateId(this.data.logs),
      type,
      message,
      data: data ? JSON.stringify(data) : null,
      created_at: new Date().toISOString()
    });
    // Keep logs bounded
    if (this.data.logs.length > 1000) {
      this.data.logs = this.data.logs.slice(-1000);
    }
    await this.save();
  }
}

export const db = new DB();
