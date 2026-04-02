import { db } from "./db.js";

interface RateLimit {
  count: number;
  limit: number;
  resetTime: number;
}

class TwitterAutomation {
  private rateLimits: Map<string, Map<string, RateLimit>> = new Map();

  private getRateLimit(account: string, action: string): RateLimit {
    if (!this.rateLimits.has(account)) {
      this.rateLimits.set(account, new Map());
    }
    const accountLimits = this.rateLimits.get(account)!;
    if (!accountLimits.has(action)) {
      // Default limits for the demo
      const limits: Record<string, number> = {
        'like': 50,
        'retweet': 30,
        'follow': 20,
        'reply': 40
      };
      accountLimits.set(action, {
        count: 0,
        limit: limits[action] || 50,
        resetTime: Date.now() + 15 * 60 * 1000 // 15 mins reset
      });
    }
    
    const limit = accountLimits.get(action)!;
    if (Date.now() > limit.resetTime) {
      limit.count = 0;
      limit.resetTime = Date.now() + 15 * 60 * 1000;
    }
    
    return limit;
  }

  async executeAction(account: string, target: string, action: string, content?: string) {
    const limit = this.getRateLimit(account, action);
    
    if (limit.count >= limit.limit) {
      const waitMins = Math.ceil((limit.resetTime - Date.now()) / 60000);
      throw new Error(`Twitter Rate Limit Hit for ${action}. Please wait ${waitMins} minutes.`);
    }

    db.addLog('system', `[Twitter] Initiating ${action} on ${target} using ${account}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    limit.count++;
    
    let message = '';
    switch (action) {
      case 'like':
        message = `Successfully liked tweet: ${target}`;
        break;
      case 'retweet':
        message = `Successfully retweeted: ${target}`;
        break;
      case 'follow':
        message = `Successfully followed user: ${target}`;
        break;
      case 'reply':
        message = `Successfully replied to ${target} with: "${content}"`;
        break;
      default:
        throw new Error(`Unknown Twitter action: ${action}`);
    }

    db.addLog('system', `[Twitter] ${message}`);
    return { 
      success: true, 
      message,
      rateLimit: {
        count: limit.count,
        limit: limit.limit,
        remaining: limit.limit - limit.count,
        resetTime: limit.resetTime
      }
    };
  }

  getAccountStatus(account: string) {
    const actions = ['like', 'retweet', 'follow', 'reply'];
    const status: Record<string, any> = {};
    actions.forEach(action => {
      const limit = this.getRateLimit(account, action);
      status[action] = {
        count: limit.count,
        limit: limit.limit,
        remaining: limit.limit - limit.count,
        resetTime: limit.resetTime,
        isApproaching: (limit.limit - limit.count) <= (limit.limit * 0.2),
        isHit: limit.count >= limit.limit
      };
    });
    return status;
  }
}

export const twitterAutomation = new TwitterAutomation();
