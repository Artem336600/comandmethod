import React from "react";
import { render, screen } from "@testing-library/react";
import { WorkspaceProjectShellView } from "@/src/modules/views/presentation";
import type { WorkspaceShellViewModel } from "@/src/modules/views/application";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

describe("WorkspaceProjectShellView", () => {
  it("should render the empty state when no active project is selected", () => {
    render(
      <WorkspaceProjectShellView
        viewModel={{
          viewer: {
            userId: "user-1",
            displayName: "Lead User",
            email: "lead@commandmethod.local",
            primaryRole: "lead"
          },
          projects: [],
          selection: {
            requestedProjectSlug: null,
            selectedProjectSlug: null,
            redirectToSlug: null,
            state: "empty"
          },
          activeProject: null
        }}
      />
    );

    expect(screen.getByText("No accessible projects yet")).toBeInTheDocument();
    expect(screen.getByText(/Assign the signed-in user to a project/i)).toBeInTheDocument();
  });

  it("should render the selected project shell, metrics, and canvas placeholder", () => {
    render(<WorkspaceProjectShellView viewModel={createWorkspaceShellViewModel()} />);

    expect(screen.getAllByText("Alpha release")).toHaveLength(2);
    expect(screen.getByText("Flow canvas placeholder")).toBeInTheDocument();
    expect(screen.getByText("Latest workflow changes")).toBeInTheDocument();
    expect(screen.getByText("Entry path delivered")).toBeInTheDocument();
    expect(screen.getByText("Dependency overview")).toBeInTheDocument();
  });
});

function createWorkspaceShellViewModel(): WorkspaceShellViewModel {
  return {
    viewer: {
      userId: "user-1",
      displayName: "Lead User",
      email: "lead@commandmethod.local",
      primaryRole: "lead"
    },
    projects: [
      {
        id: "project-1",
        name: "Alpha release",
        slug: "alpha-release",
        status: "active",
        description: "Alpha release workspace",
        startBlockId: "block-1",
        finishBlockId: "block-2",
        createdAt: new Date("2026-03-11T09:00:00.000Z"),
        updatedAt: new Date("2026-03-11T09:00:00.000Z"),
        href: "/projects/alpha-release",
        isActive: true
      }
    ],
    selection: {
      requestedProjectSlug: "alpha-release",
      selectedProjectSlug: "alpha-release",
      redirectToSlug: null,
      state: "resolved"
    },
    activeProject: {
      id: "project-1",
      name: "Alpha release",
      slug: "alpha-release",
      status: "active",
      description: "Alpha release workspace",
      startBlockId: "block-1",
      finishBlockId: "block-2",
      createdAt: new Date("2026-03-11T09:00:00.000Z"),
      updatedAt: new Date("2026-03-11T09:00:00.000Z"),
      href: "/projects/alpha-release",
      metrics: {
        totalBlocks: 2,
        completedBlocks: 1,
        blockedBlocks: 0,
        inFlightBlocks: 1,
        readyBlocks: 1,
        dependencyCount: 1,
        projectAssignmentsCount: 1,
        projectCommentsCount: 1,
        blockCommentCount: 1,
        blockAssignmentCount: 1
      },
      snapshot: {
        projectId: "project-1",
        blocks: [
          {
            id: "block-1",
            projectId: "project-1",
            parentBlockId: null,
            title: "Entry path delivered",
            summary: "Entry path summary",
            expectedResult: "Users can enter the flow.",
            definitionOfDone: ["QA approved"],
            acceptanceCriteria: ["Supports onboarding"],
            ownerId: "user-2",
            status: "ready",
            blocker: null,
            kind: "deliverable",
            createdAt: new Date("2026-03-11T09:00:00.000Z"),
            updatedAt: new Date("2026-03-11T09:00:00.000Z")
          },
          {
            id: "block-2",
            projectId: "project-1",
            parentBlockId: null,
            title: "Release candidate approved",
            summary: "Release summary",
            expectedResult: "Candidate is approved.",
            definitionOfDone: ["Review complete"],
            acceptanceCriteria: ["Release checklist complete"],
            ownerId: "user-3",
            status: "in_review",
            blocker: null,
            kind: "review",
            createdAt: new Date("2026-03-11T10:00:00.000Z"),
            updatedAt: new Date("2026-03-11T10:00:00.000Z")
          }
        ],
        dependencies: [
          {
            id: "dependency-1",
            projectId: "project-1",
            predecessorBlockId: "block-1",
            successorBlockId: "block-2",
            createdAt: new Date("2026-03-11T10:30:00.000Z")
          }
        ],
        projectAssignments: [
          {
            id: "assignment-1",
            targetType: "project",
            targetId: "project-1",
            projectId: "project-1",
            role: "lead",
            subjectUserId: "user-1",
            assignedByUserId: "admin-1",
            createdAt: new Date("2026-03-11T09:00:00.000Z"),
            revokedAt: null
          }
        ],
        blockAssignments: {
          "block-1": [
            {
              id: "assignment-2",
              targetType: "block",
              targetId: "block-1",
              projectId: "project-1",
              role: "owner",
              subjectUserId: "user-2",
              assignedByUserId: "user-1",
              createdAt: new Date("2026-03-11T09:30:00.000Z"),
              revokedAt: null
            }
          ]
        },
        projectComments: [
          {
            id: "comment-1",
            targetType: "project",
            targetId: "project-1",
            projectId: "project-1",
            authorUserId: "user-1",
            body: "Project shell is ready.",
            createdAt: new Date("2026-03-11T09:40:00.000Z"),
            editedAt: null
          }
        ],
        blockComments: {
          "block-1": [
            {
              id: "comment-2",
              targetType: "block",
              targetId: "block-1",
              projectId: "project-1",
              authorUserId: "user-2",
              body: "Block is ready.",
              createdAt: new Date("2026-03-11T09:45:00.000Z"),
              editedAt: null
            }
          ]
        },
        statusHistoryByBlock: {
          "block-2": [
            {
              id: "history-1",
              blockId: "block-2",
              fromStatus: "in_review",
              toStatus: "done",
              changedByUserId: "user-1",
              eventType: "status_changed",
              reason: "Approved for release",
              blocker: null,
              occurredAt: new Date("2026-03-11T11:00:00.000Z")
            }
          ]
        }
      }
    }
  };
}
