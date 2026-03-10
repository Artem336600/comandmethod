import Link from "next/link";
import { PageShell, ShellCard } from "@/src/shared/ui";

export function MarketingHero() {
  return (
    <PageShell>
      <section
        style={{
          display: "grid",
          gap: "2rem",
          alignContent: "center",
          minHeight: "calc(100vh - 6rem)"
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "1rem",
            padding: "2rem",
            border: "1px solid var(--border)",
            borderRadius: "1.5rem",
            background: "linear-gradient(180deg, rgba(17, 27, 47, 0.92), rgba(10, 15, 28, 0.92))"
          }}
        >
          <span style={{ color: "var(--accent)", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "0.75rem" }}>
            CommandMethod
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(2.8rem, 7vw, 5.5rem)", lineHeight: 0.95 }}>
            See delivery as a system, not a pile of tickets.
          </h1>
          <p style={{ margin: 0, maxWidth: "48rem", color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7 }}>
            CommandMethod turns software delivery into a graph-first workspace where dependencies,
            ownership, blockers, and project momentum stay visible from start to release.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <Link
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "3rem",
                padding: "0 1.25rem",
                borderRadius: "999px",
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                color: "#05111f",
                fontWeight: 700
              }}
            >
              Open workspace
            </Link>
            <div style={{ display: "inline-flex", alignItems: "center", color: "var(--muted)" }}>
              Foundation routes are ready for auth and graph features.
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <ShellCard
            eyebrow="Visibility"
            title="Shared project map"
            description="Move beyond flat kanban views and expose sequence, parallel work, and merge points."
          />
          <ShellCard
            eyebrow="Ownership"
            title="Responsibility in context"
            description="Keep owners, assignees, reviewers, blockers, and outcomes connected to each stage."
          />
          <ShellCard
            eyebrow="Momentum"
            title="Execution signals"
            description="Highlight what is blocked, what is ready, and where the delivery graph is stalling."
          />
        </div>
      </section>
    </PageShell>
  );
}
