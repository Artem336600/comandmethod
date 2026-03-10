import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/src/shared/auth";
import { WorkspaceShell } from "@/src/modules/views/presentation/workspace-shell";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("views/workspace-layout");

type WorkspaceLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  logger.info("[workspace-layout] Preparing workspace shell");

  const sessionPromise = getServerSession();

  return sessionPromise.then((session) => {
    if (!session) {
      logger.warn("[workspace-layout] Missing session in workspace layout");
      redirect("/sign-in?next=/projects");
    }

    return (
      <WorkspaceShell
        session={{
          displayName: session.displayName,
          email: session.email
        }}
      >
        {children}
      </WorkspaceShell>
    );
  });
}
