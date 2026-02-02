# Node.js CLI/API Patterns

**This reference is specific to Node.js backend applications (CLIs, APIs, services).**

For universal patterns, see [../SKILL.md](../SKILL.md).  
For DDD patterns, see [ddd-rules.md](ddd-rules.md).

---

## When to Use

- Building Node.js CLIs
- Building Express/Fastify/Hono APIs  
- Building background workers/cron jobs
- Building Node.js services (no frontend)

**Default Structure Philosophy:**
- Use `src/core/` for most projects (simple and direct)
- Only add `features/` if you have **multiple independent domains**
- Keep it simple unless complexity demands otherwise

---

## Project Structure

### Simple Structure (Recommended for most projects)

```
src/
  core/               # Business logic & application layer
    domain/           # Pure business logic (ZERO dependencies)
      entities/
        listing.ts
        event.ts
      value-objects/
        money.ts
        listing-id.ts
      repositories/   # Interfaces ONLY
        listing-repository.ts
      services/
        scoring-service.ts
    
    application/      # Use cases (orchestration)
      services/
        search-run-service.ts
        daily-report-service.ts
    
    infrastructure/   # Adapters (external dependencies)
      db/
        prisma-client.ts
        repositories/
          prisma-listing-repository.ts
      http/
        scrapers/
          idealista-scraper.ts
      messaging/
        telegram-client.ts
  
  shared/             # Cross-cutting utilities
    logging/
      logger.ts
    config/
      config-loader.ts
    errors/
      base-error.ts
    time/
      clock.ts
  
  app/                # Entry points (NOT routing)
    cli/              # CLI commands
      commands/
        run-scrape.ts
        send-report.ts
    server.ts         # HTTP server (if API)
    bootstrap.ts      # Application initialization
```

**Key Difference from Next.js:**
- ❌ NO `app/` as routing layer (that's Next.js)
- ✅ `app/` = Entry points (CLI, server bootstrap)
- ❌ NO components, hooks, or React concepts
- ✅ Focus on services, models, and business logic

---

### When to Use Features (Optional)

If your project has **multiple independent domains** (e.g., billing + inventory + shipping), consider using features:

```
src/
  features/
    billing/
      domain/
      application/
      infrastructure/
    
    inventory/
      domain/
      application/
      infrastructure/
  
  shared/
  app/
```

**Otherwise, stick to the simple structure above (src/core/).**

---

## DDD Layer Rules

**Critical Dependencies:**
- `domain/` NEVER imports from `infrastructure/` or `application/`
- `application/` imports `domain/` and `infrastructure/`
- `infrastructure/` implements interfaces defined in `domain/`

---

## Terminology Clarification

### `app/` in Node.js vs Next.js

**Next.js:**
```
app/                 # App Router (routing layer)
  dashboard/
    page.tsx         # Route: /dashboard
  api/
    route.ts         # API endpoint
```

**Node.js CLI/API:**
```
app/                 # Entry points (NOT routing)
  cli/
    commands/
      run-scrape.ts  # CLI command
  bootstrap.ts       # Main entry point
  server.ts          # HTTP server setup (if API)
```

**When using DDD in Node.js:**
```
src/core/
  application/       # Use cases layer (NOT entry points)
    services/        # Application services (orchestration)
```

---

## Example: CLI Application

### Project: Real Estate Scraper

```
src/
  core/
    services/
      scraper.service.ts
      telegram.service.ts
    models/
      listing.ts
    types/
      scraper.types.ts
    utils/
      throttle.ts
  
  shared/
    logging/
      logger.ts
    config/
      config-loader.ts
    time/
      clock.ts
  
  app/
    cli/
      commands/
        run-scrape.ts      # Command: pnpm cli:scrape
        send-report.ts     # Command: pnpm cli:report
    bootstrap.ts           # Main: pnpm start
```

---

## Example: API Application

### Project: REST API

```
src/
  core/
    services/
      user.service.ts
      post.service.ts
    models/
      user.model.ts
      post.model.ts
    types/
      user.types.ts
      post.types.ts
  
  shared/
    middleware/
      auth.middleware.ts
      error.middleware.ts
    errors/
      http-error.ts
  
  app/
    routes/              # HTTP routes
      users.routes.ts
      posts.routes.ts
    server.ts            # Express/Fastify setup
```

**Route Example (Express):**
```typescript
// app/routes/users.routes.ts
import { Router } from "express";
import { UserService } from "@/core/services/user.service";

const router = Router();

router.get("/users", async (req, res) => {
  const userService = new UserService();
  const users = await userService.getAll();
  res.json(users);
});

export default router;
```

---

## Entry Point Patterns

### CLI Entry Point

```typescript
// app/cli/commands/run-scrape.ts
import { ScraperService } from "@/core/services/scraper.service";
import { logger } from "@/shared/logging/logger";
import { loadConfig } from "@/shared/config/config-loader";

async function runScrapeCommand() {
  try {
    const config = loadConfig();
    const scraper = new ScraperService(config);
    
    logger.info("Starting scrape...");
    await scraper.execute();
    logger.info("Scrape completed");
    
    process.exit(0);
  } catch (error) {
    logger.error("Scrape failed", error);
    process.exit(1);
  }
}

// Allow running directly: pnpm tsx app/cli/commands/run-scrape.ts
if (require.main === module) {
  runScrapeCommand();
}
```

### Bootstrap Entry Point

```typescript
// app/bootstrap.ts
import { loadConfig } from "@/shared/config/config-loader";
import { logger } from "@/shared/logging/logger";
import { ScraperService } from "@/core/services/scraper.service";
import cron from "node-cron";

async function bootstrap() {
  // 1. Load configuration
  const config = loadConfig();
  logger.info("Configuration loaded");
  
  // 2. Initialize services
  const scraper = new ScraperService(config);
  
  // 3. Schedule tasks
  cron.schedule(config.scraping.schedule, async () => {
    logger.info("Running scheduled scrape");
    await scraper.execute();
  });
  
  logger.info("Application started");
}

bootstrap().catch((error) => {
  logger.error("Bootstrap failed", error);
  process.exit(1);
});
```

### API Server Entry Point

```typescript
// app/server.ts
import express from "express";
import { loadConfig } from "@/shared/config/config-loader";
import { logger } from "@/shared/logging/logger";
import usersRouter from "./routes/users.routes";
import postsRouter from "./routes/posts.routes";

async function startServer() {
  const config = loadConfig();
  const app = express();
  
  // Middleware
  app.use(express.json());
  
  // Routes
  app.use("/api", usersRouter);
  app.use("/api", postsRouter);
  
  // Start
  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
}

startServer().catch(console.error);
```

---

## DDD Entry Points

When using DDD, entry points orchestrate application services:

```typescript
// app/cli/commands/run-scrape.ts
import { SearchRunService } from "@/core/application/services/search-run-service";
import { NotificationService } from "@/core/application/services/notification-service";

// Infrastructure implementations
import { PrismaListingRepository } from "@/core/infrastructure/db/repositories/prisma-listing-repository";
import { TelegramClient } from "@/core/infrastructure/messaging/telegram-client";

async function runScrapeCommand() {
  // Wire up dependencies (or use DI container)
  const listingRepo = new PrismaListingRepository();
  const telegramClient = new TelegramClient();
  
  const searchRunService = new SearchRunService(listingRepo);
  const notificationService = new NotificationService(telegramClient);
  
  // Execute use case
  const result = await searchRunService.execute();
  await notificationService.sendResults(result);
}
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/app/bootstrap.ts",
    "build": "tsc && tsc-alias",
    "start": "node dist/app/bootstrap.js",
    
    "cli:scrape": "tsx src/app/cli/commands/run-scrape.ts",
    "cli:report": "tsx src/app/cli/commands/send-report.ts",
    
    "test": "vitest",
    "test:unit": "vitest run --dir tests/unit",
    "test:integration": "vitest run --dir tests/integration"
  }
}
```

---

## Commands

```bash
# Create simple Node.js structure
mkdir -p src/core/{services,models,types,utils}
mkdir -p src/shared/{logging,config,errors,time}
mkdir -p src/app/cli/commands

# Create API structure
mkdir -p src/app/routes

# Create DDD structure
mkdir -p src/core/{domain,application,infrastructure}
mkdir -p src/core/domain/{entities,value-objects,repositories,services}
mkdir -p src/core/application/services
mkdir -p src/core/infrastructure/{db,http,messaging}

# If you need features (multiple domains)
mkdir -p src/features/{billing,inventory}/{domain,application,infrastructure}
```

---

## Common Patterns

### Configuration Loading

```typescript
// shared/config/config-loader.ts
import { z } from "zod";
import { readFileSync } from "fs";
import YAML from "yaml";

const configSchema = z.object({
  port: z.number().default(3000),
  database: z.object({
    url: z.string(),
  }),
  scraping: z.object({
    schedule: z.string(),
    throttle: z.number(),
  }),
});

export type AppConfig = z.infer<typeof configSchema>;

export function loadConfig(): AppConfig {
  const file = readFileSync("config/config.yaml", "utf8");
  const raw = YAML.parse(file);
  
  const result = configSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid config: ${result.error}`);
  }
  
  return result.data;
}
```

### Structured Logging

```typescript
// shared/logging/logger.ts
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: "info", message, ...meta, timestamp: new Date() }));
  },
  error: (message: string, error?: unknown) => {
    console.error(JSON.stringify({ level: "error", message, error, timestamp: new Date() }));
  },
};
```

### Error Handling

```typescript
// shared/errors/base-error.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

// core/errors/scraper-error.ts
import { AppError } from "@/shared/errors/base-error";

export class ScraperError extends AppError {
  constructor(message: string, public portal: string) {
    super(message, "SCRAPER_ERROR", 500);
    this.name = "ScraperError";
  }
}
```

---

## Anti-Patterns in Node.js

### ❌ Mixing Routing with Business Logic

```typescript
// Bad: Business logic in route handler
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();  // ❌ Direct DB access
  const formatted = users.map(u => ({...}));   // ❌ Business logic here
  res.json(formatted);
});
```

### ✅ Separation of Concerns

```typescript
// Good: Delegate to service
app.get("/users", async (req, res) => {
  const userService = new UserService();
  const users = await userService.getAll();
  res.json(users);
});
```

---

### ❌ Global State

```typescript
// Bad: Global mutable state
let config: AppConfig;
export function initConfig() {
  config = loadConfig();
}
```

### ✅ Dependency Injection

```typescript
// Good: Pass dependencies
class ScraperService {
  constructor(private config: AppConfig) {}
}
```

---

## Resources

- **Universal Patterns**: [../SKILL.md](../SKILL.md)
- **DDD Patterns**: [ddd-rules.md](ddd-rules.md)
