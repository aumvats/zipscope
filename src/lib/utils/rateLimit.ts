// In-memory IP-based rate limiting for anonymous users (5 lookups/day)
const ipMap = new Map<string, { count: number; resetAt: number }>();

const ANON_DAILY_LIMIT = 5;

export function checkAnonymousRateLimit(ip: string): { allowed: boolean; count: number; limit: number } {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + 86400000 });
    return { allowed: true, count: 1, limit: ANON_DAILY_LIMIT };
  }

  if (entry.count >= ANON_DAILY_LIMIT) {
    return { allowed: false, count: entry.count, limit: ANON_DAILY_LIMIT };
  }

  entry.count++;
  return { allowed: true, count: entry.count, limit: ANON_DAILY_LIMIT };
}

// Cleanup stale entries every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    ipMap.forEach((entry, ip) => {
      if (now > entry.resetAt) ipMap.delete(ip);
    });
  }, 3600000);
}
