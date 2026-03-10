import { MarketingHero } from "@/src/modules/views/presentation/marketing-hero";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("views/marketing-page");

export default function MarketingPage() {
  logger.debug("[marketing-page] Rendering marketing page");

  return <MarketingHero />;
}
