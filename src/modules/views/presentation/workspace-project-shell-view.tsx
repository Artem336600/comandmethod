import React from "react";
import Link from "next/link";
import type { WorkspaceShellViewModel } from "@/src/modules/views/application";
import { ShellCard } from "@/src/shared/ui";

type WorkspaceProjectShellViewProps = {
  viewModel: WorkspaceShellViewModel;
};

export function WorkspaceProjectShellView({ viewModel }: WorkspaceProjectShellViewProps) {
  if (!viewModel.activeProject) {
    return (
      <section style={{ display: "grid", gap: "1rem" }}>
        <WorkspaceProjectRail projects={viewModel.projects} />
        <WorkspaceEmptyState
          title="No accessible projects yet"
          description="Assign the signed-in user to a project to unlock the authenticated workspace shell. This route now supports project selection and will host the canvas/sidebar layout for active work."
        />
      </section>
    );
  }

  const activeProject = viewModel.activeProject;
  const latestHistory = Object.values(activeProject.snapshot.statusHistoryByBlock)
    .flat()
    .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
    .slice(0, 4);
  const highlightedBlocks = [...activeProject.snapshot.blocks]
    .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
    .slice(0, 5);

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <WorkspaceProjectRail projects={viewModel.projects} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "stretch"
        }}
      >
        <aside
          style={{
            display: "grid",
            gap: "1rem",
            flex: "1 1 18rem",
            minWidth: "min(100%, 18rem)"
          }}
        >
          <ShellCard
            eyebrow={activeProject.status}
            title={activeProject.name}
            description={activeProject.description ?? "Active workspace shell for the selected delivery map."}
          >
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <MetricRow label="Primary role" value={viewModel.viewer.primaryRole} />
              <MetricRow label="Blocks" value={String(activeProject.metrics.totalBlocks)} />
              <MetricRow label="Dependencies" value={String(activeProject.metrics.dependencyCount)} />
              <MetricRow label="Ready" value={String(activeProject.metrics.readyBlocks)} />
              <MetricRow label="In flight" value={String(activeProject.metrics.inFlightBlocks)} />
              <MetricRow label="Blocked" value={String(activeProject.metrics.blockedBlocks)} />
              <MetricRow label="Done" value={String(activeProject.metrics.completedBlocks)} />
            </div>
          </ShellCard>

          <ShellCard
            eyebrow="Collaboration"
            title="Project activity surface"
            description="These counters anchor the sidebar until the dedicated collaboration milestone adds full audit, comments, and assignment management flows."
          >
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <MetricRow label="Project assignments" value={String(activeProject.metrics.projectAssignmentsCount)} />
              <MetricRow label="Block assignments" value={String(activeProject.metrics.blockAssignmentCount)} />
              <MetricRow label="Project comments" value={String(activeProject.metrics.projectCommentsCount)} />
              <MetricRow label="Block comments" value={String(activeProject.metrics.blockCommentCount)} />
            </div>
          </ShellCard>
        </aside>

        <div
          style={{
            display: "grid",
            gap: "1rem",
            flex: "999 1 34rem",
            minWidth: "min(100%, 22rem)"
          }}
        >
          <ShellCard
            eyebrow="Canvas shell"
            title="Flow canvas placeholder"
            description="The workspace now has a stable, selected-project stage for the upcoming Flow Canvas milestone. This placeholder shows the currently loaded graph inventory without moving graph rules into the UI."
          >
            <div
              style={{
                display: "grid",
                gap: "1rem",
                padding: "1rem",
                borderRadius: "1rem",
                border: "1px dashed var(--border)",
                background: "linear-gradient(180deg, rgba(82, 210, 255, 0.08), rgba(8, 14, 25, 0.5))"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem"
                }}
              >
                {highlightedBlocks.length > 0 ? (
                  highlightedBlocks.map((block) => (
                    <div
                      key={block.id}
                      style={{
                        display: "grid",
                        gap: "0.35rem",
                        minWidth: "12rem",
                        padding: "0.9rem",
                        borderRadius: "0.9rem",
                        border: "1px solid var(--border)",
                        background: "rgba(17, 27, 47, 0.88)"
                      }}
                    >
                      <span style={{ color: "var(--accent)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {block.status.replace("_", " ")}
                      </span>
                      <strong>{block.title}</strong>
                      <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        {block.expectedResult ?? "Expected result not defined yet"}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ color: "var(--muted)" }}>
                    No blocks are visible yet. The selected project still benefits from the new shell and routing baseline.
                  </span>
                )}
              </div>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  Start block: {activeProject.startBlockId ?? "not configured"} · Finish block: {activeProject.finishBlockId ?? "not configured"}
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  Selected project slug: {activeProject.slug} · Viewer: {viewModel.viewer.displayName}
                </span>
              </div>
            </div>
          </ShellCard>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))"
            }}
          >
            <ShellCard
              eyebrow="Recent status history"
              title="Latest workflow changes"
              description="Status history remains server-derived and audit-safe. The shell only projects the latest entries."
            >
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {latestHistory.length > 0 ? (
                  latestHistory.map((entry) => (
                    <div key={entry.id} style={{ display: "grid", gap: "0.2rem" }}>
                      <strong>{entry.toStatus.replace("_", " ")}</strong>
                      <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        Block {entry.blockId} · {entry.reason ?? "No reason provided"}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ color: "var(--muted)" }}>
                    No status history has been recorded for this project yet.
                  </span>
                )}
              </div>
            </ShellCard>

            <ShellCard
              eyebrow="Graph inventory"
              title="Dependency overview"
              description="The selected project snapshot is available now, so the next milestone can attach interactive graph rendering to an already stable workspace frame."
            >
              <div style={{ display: "grid", gap: "0.6rem" }}>
                <MetricRow label="Dependency edges" value={String(activeProject.snapshot.dependencies.length)} />
                <MetricRow label="Tracked blocks" value={String(activeProject.snapshot.blocks.length)} />
                <MetricRow
                  label="Status histories"
                  value={String(Object.values(activeProject.snapshot.statusHistoryByBlock).flat().length)}
                />
              </div>
            </ShellCard>
          </div>
        </div>
      </div>
    </section>
  );
}

type WorkspaceProjectRailProps = {
  projects: WorkspaceShellViewModel["projects"];
};

function WorkspaceProjectRail({ projects }: WorkspaceProjectRailProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        overflowX: "auto",
        paddingBottom: "0.25rem"
      }}
    >
      {projects.map((project) => (
        <Link
          key={project.id}
          href={project.href}
          style={{
            display: "grid",
            gap: "0.25rem",
            minWidth: "14rem",
            padding: "0.95rem 1rem",
            borderRadius: "1rem",
            border: project.isActive ? "1px solid rgba(82, 210, 255, 0.55)" : "1px solid var(--border)",
            background: project.isActive
              ? "linear-gradient(180deg, rgba(82, 210, 255, 0.18), rgba(17, 27, 47, 0.92))"
              : "rgba(8, 14, 25, 0.82)"
          }}
        >
          <span style={{ color: "var(--accent)", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {project.status}
          </span>
          <strong>{project.name}</strong>
          <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            {project.description ?? "Workspace shell is ready for canvas composition."}
          </span>
        </Link>
      ))}
    </div>
  );
}

type WorkspaceEmptyStateProps = {
  title: string;
  description: string;
};

function WorkspaceEmptyState({ title, description }: WorkspaceEmptyStateProps) {
  return (
    <ShellCard
      eyebrow="Workspace empty state"
      title={title}
      description={description}
    >
      <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>
        The route and shell stay stable even when the signed-in user has no accessible project assignments yet.
      </span>
    </ShellCard>
  );
}

type MetricRowProps = {
  label: string;
  value: string;
};

function MetricRow({ label, value }: MetricRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        color: "var(--muted)"
      }}
    >
      <span>{label}</span>
      <strong style={{ color: "var(--text)" }}>{value}</strong>
    </div>
  );
}
