import type { ProjectSummaryReadModel } from "./list-project-summaries-service";

export type WorkspaceProjectSelection = {
  requestedProjectSlug: string | null;
  selectedProject: ProjectSummaryReadModel | null;
  redirectToSlug: string | null;
  state: "empty" | "resolved" | "redirect";
};

export function resolveWorkspaceProjectSelection(input: {
  projects: ProjectSummaryReadModel[];
  requestedProjectSlug?: string | null;
}): WorkspaceProjectSelection {
  const requestedProjectSlug = input.requestedProjectSlug?.trim().toLowerCase() ?? null;
  const defaultProject = input.projects[0] ?? null;

  if (!defaultProject) {
    return {
      requestedProjectSlug,
      selectedProject: null,
      redirectToSlug: null,
      state: "empty"
    };
  }

  if (!requestedProjectSlug) {
    return {
      requestedProjectSlug: null,
      selectedProject: defaultProject,
      redirectToSlug: defaultProject.slug,
      state: "redirect"
    };
  }

  const requestedProject = input.projects.find((project) => project.slug === requestedProjectSlug);

  if (requestedProject) {
    return {
      requestedProjectSlug,
      selectedProject: requestedProject,
      redirectToSlug: null,
      state: "resolved"
    };
  }

  return {
    requestedProjectSlug,
    selectedProject: defaultProject,
    redirectToSlug: defaultProject.slug,
    state: "redirect"
  };
}
