import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export const lighthouseCreateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "rl:create",
})

export const signalByIpLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "15 m"),
  prefix: "rl:signal:ip",
})

export const signalBySlugLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(20, "1 h"),
  prefix: "rl:signal:slug",
})

export const checkSlugLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(30, "1 m"),
  prefix: "rl:check",
})
