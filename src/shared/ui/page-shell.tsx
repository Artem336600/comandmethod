import React from "react";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main
      style={{
        display: "grid",
        minHeight: "100vh",
        width: "100%"
      }}
    >
      <section
        style={{
          display: "grid",
          gap: "2rem",
          width: "100%",
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "3rem 1.5rem"
        }}
      >
        {children}
      </section>
    </main>
  );
}
