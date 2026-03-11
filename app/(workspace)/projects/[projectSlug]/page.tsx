import { redirect } from "next/navigation";
import { WorkspaceProjectShellView } from "@/src/modules/views/presentation";
import { createModuleLogger } from "@/src/shared/lib";
import { loadWorkspaceShellViewModel } from "../workspace-shell-data";

const logger = createModuleLogger("views/project-shell-page");

type ProjectShellPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

export default async function ProjectShellPage({ params }: ProjectShellPageProps) {
  const { projectSlug } = await params;

  logger.debug("[project-shell-page] Rendering selected project workspace shell", {
    projectSlug
  });

  const viewModel = await loadWorkspaceShellViewModel(projectSlug);

  if (viewModel.selection.redirectToSlug && viewModel.selection.redirectToSlug !== projectSlug) {
    logger.warn("[project-shell-page] Redirecting unavailable project slug to accessible project", {
      projectSlug,
      redirectToSlug: viewModel.selection.redirectToSlug
    });
    redirect(`/projects/${viewModel.selection.redirectToSlug}`);
  }

  return <WorkspaceProjectShellView viewModel={viewModel} />;
}
