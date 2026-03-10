export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

const DEFAULT_LOG_LEVEL: LogLevel = "info";

function normalizeLogLevel(value: string | undefined): LogLevel {
  if (!value) {
    return DEFAULT_LOG_LEVEL;
  }

  const normalized = value.toLowerCase();
  if (normalized === "debug" || normalized === "info" || normalized === "warn" || normalized === "error") {
    return normalized;
  }

  return DEFAULT_LOG_LEVEL;
}

const configuredLogLevel = normalizeLogLevel(process.env.LOG_LEVEL);

function shouldLog(level: LogLevel): boolean {
  return LOG_PRIORITY[level] >= LOG_PRIORITY[configuredLogLevel];
}

function write(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    level,
    message,
    context,
    timestamp: new Date().toISOString()
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

function createChildLogger(defaultContext: Record<string, unknown>) {
  return {
    debug(message: string, context?: Record<string, unknown>) {
      write("debug", message, { ...defaultContext, ...context });
    },
    info(message: string, context?: Record<string, unknown>) {
      write("info", message, { ...defaultContext, ...context });
    },
    warn(message: string, context?: Record<string, unknown>) {
      write("warn", message, { ...defaultContext, ...context });
    },
    error(message: string, context?: Record<string, unknown>) {
      write("error", message, { ...defaultContext, ...context });
    },
    child(context: Record<string, unknown>) {
      return createChildLogger({ ...defaultContext, ...context });
    }
  };
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    write("debug", message, context);
  },
  info(message: string, context?: Record<string, unknown>) {
    write("info", message, context);
  },
  warn(message: string, context?: Record<string, unknown>) {
    write("warn", message, context);
  },
  error(message: string, context?: Record<string, unknown>) {
    write("error", message, context);
  },
  child(defaultContext: Record<string, unknown>) {
    return createChildLogger(defaultContext);
  },
  getLevel(): LogLevel {
    return configuredLogLevel;
  }
};

logger.debug("[logger] Initialized logger", { configuredLogLevel });
