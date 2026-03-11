import { redirect } from "next/navigation";
import { WorkspaceProjectShellView } from "@/src/modules/views/presentation";
import { createModuleLogger } from "@/src/shared/lib";
import { loadWorkspaceShellViewModel } from "./workspace-shell-data";

const logger = createModuleLogger("views/projects-page");

export default async function ProjectsPage() {
  logger.debug("[projects-page] Rendering projects workspace entry");
  const viewModel = await loadWorkspaceShellViewModel();

  if (viewModel.selection.redirectToSlug) {
    logger.info("[projects-page] Redirecting to selected workspace project", {
      redirectToSlug: viewModel.selection.redirectToSlug
    });
    redirect(`/projects/${viewModel.selection.redirectToSlug}`);
  }

  return <WorkspaceProjectShellView viewModel={viewModel} />;
}
