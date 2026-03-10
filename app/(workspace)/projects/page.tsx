import { getServerSession } from "@/src/shared/auth";
import { buildWorkspaceAccessViewModel } from "@/src/modules/projects/application";
import { createModuleLogger } from "@/src/shared/lib";
import { ShellCard } from "@/src/shared/ui";

const logger = createModuleLogger("views/projects-page");

export default async function ProjectsPage() {
  logger.debug("[projects-page] Rendering projects workspace entry");
  const session = await getServerSession();

  if (!session) {
    throw new Error("Projects page requires an active session.");
  }

  const viewModel = buildWorkspaceAccessViewModel(session);

  return (
    <section style={{ display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <span style={{ color: "var(--accent)", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Workspace
        </span>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Projects</h1>
        <p style={{ margin: 0, color: "var(--muted)", maxWidth: "48rem", lineHeight: 1.7 }}>
          Signed in as {viewModel.displayName} ({viewModel.primaryRole}). The graph workspace is not
          implemented yet, but this route is now the stable entry point for authenticated project
          work.
        </p>
      </div>

      <ShellCard
        eyebrow="Next milestone"
        title="Project map canvas"
        description="The next implementation steps will attach graph data, workflow states, and block interactions to this workspace shell."
      >
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
          Active session email: {viewModel.email}
        </p>
      </ShellCard>
    </section>
  );
}
