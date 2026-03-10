import Link from "next/link";
import { PageShell } from "@/src/shared/ui";

type WorkspaceShellProps = {
  session: {
    displayName: string;
    email: string;
  };
  children: React.ReactNode;
};

export function WorkspaceShell({ session, children }: WorkspaceShellProps) {
  return (
    <PageShell>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          padding: "1.25rem",
          borderRadius: "1.5rem",
          border: "1px solid var(--border)",
          background: "rgba(8, 14, 25, 0.7)"
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Workspace Shell
            </span>
            <strong style={{ fontSize: "1.25rem" }}>CommandMethod</strong>
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              {session.displayName} · {session.email}
            </span>
          </div>
          <nav style={{ display: "flex", gap: "1rem", color: "var(--muted)" }}>
            <Link href="/">Home</Link>
            <Link href="/projects">Projects</Link>
            <form action="/api/auth/sign-out" method="post">
              <button
                type="submit"
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Sign out
              </button>
            </form>
          </nav>
        </header>
        {children}
      </div>
    </PageShell>
  );
}
