import { logger } from "@/src/shared/lib/logger";

export function createModuleLogger(moduleName: string) {
  return logger.child({
    module: moduleName
  });
}
