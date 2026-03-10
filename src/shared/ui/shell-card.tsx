type ShellCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function ShellCard({ eyebrow, title, description, children }: ShellCardProps) {
  return (
    <article
      style={{
        display: "grid",
        gap: "0.9rem",
        padding: "1.5rem",
        borderRadius: "1.25rem",
        border: "1px solid var(--border)",
        background: "linear-gradient(180deg, rgba(17, 27, 47, 0.92), rgba(8, 14, 25, 0.92))"
      }}
    >
      {eyebrow ? (
        <span style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {eyebrow}
        </span>
      ) : null}
      <div style={{ display: "grid", gap: "0.45rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{title}</h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65 }}>{description}</p>
      </div>
      {children}
    </article>
  );
}
