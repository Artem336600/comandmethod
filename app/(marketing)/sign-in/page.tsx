import { createModuleLogger } from "@/src/shared/lib";
import { PageShell, ShellCard } from "@/src/shared/ui";

const logger = createModuleLogger("views/sign-in-page");

type SignInPageProps = {
  searchParams?: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;
  const next = resolvedSearchParams?.next ?? "/projects";
  const hasValidationError = resolvedSearchParams?.error === "validation";

  logger.info("[sign-in-page] Rendering sign-in page", {
    next,
    hasValidationError
  });

  return (
    <PageShell>
      <ShellCard
        eyebrow="Auth baseline"
        title="Workspace sign-in"
        description="This is a temporary development sign-in flow that issues a signed session cookie for workspace access."
      >
        <form action="/api/auth/sign-in" method="post" style={{ display: "grid", gap: "0.9rem" }}>
          <input type="hidden" name="next" value={next} />
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="team@commandmethod.local"
              style={{
                minHeight: "2.75rem",
                borderRadius: "0.9rem",
                border: "1px solid var(--border)",
                background: "rgba(10, 15, 28, 0.72)",
                color: "var(--text)",
                padding: "0 0.9rem"
              }}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Display name</span>
            <input
              name="displayName"
              type="text"
              required
              placeholder="CommandMethod Dev"
              style={{
                minHeight: "2.75rem",
                borderRadius: "0.9rem",
                border: "1px solid var(--border)",
                background: "rgba(10, 15, 28, 0.72)",
                color: "var(--text)",
                padding: "0 0.9rem"
              }}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Role</span>
            <select
              name="role"
              defaultValue="member"
              style={{
                minHeight: "2.75rem",
                borderRadius: "0.9rem",
                border: "1px solid var(--border)",
                background: "rgba(10, 15, 28, 0.72)",
                color: "var(--text)",
                padding: "0 0.9rem"
              }}
            >
              <option value="admin">admin</option>
              <option value="pm">pm</option>
              <option value="lead">lead</option>
              <option value="member">member</option>
              <option value="viewer">viewer</option>
            </select>
          </label>
          {hasValidationError ? (
            <p style={{ margin: 0, color: "#ff8f8f" }}>Validation failed. Check the submitted values and try again.</p>
          ) : null}
          <button
            type="submit"
            style={{
              minHeight: "3rem",
              borderRadius: "999px",
              border: 0,
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              color: "#05111f",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Create session
          </button>
        </form>
      </ShellCard>
    </PageShell>
  );
}
