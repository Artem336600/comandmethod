# Architecture: Modular Monolith

## Overview
This project should start as a modular monolith. The product has meaningful domain complexity around graph structure, workflow validation, role assignments, and derived project state, but it does not need the operational cost of microservices in MVP.

A modular monolith keeps a single deployable application while enforcing boundaries between product areas such as projects, blocks, graph rules, comments, and views. That gives enough structure for a team product while keeping initial delivery speed high.

## Decision Rationale
- **Project type:** Collaborative web product for visual planning and execution of software delivery
- **Tech stack:** TypeScript, Next.js, PostgreSQL, Prisma
- **Key factor:** The domain is richer than simple CRUD, but the team can move faster with one application and strong internal module boundaries

## Folder Structure
```text
app/
  (marketing)/             public pages and landing flows
  (workspace)/             authenticated product routes
  api/                     route handlers and webhooks
src/
  modules/
    projects/
      domain/
      application/
      infrastructure/
      presentation/
    blocks/
      domain/
      application/
      infrastructure/
      presentation/
    graph/
      domain/
      application/
      infrastructure/
    assignments/
      domain/
      application/
      infrastructure/
    comments/
      domain/
      application/
      infrastructure/
    views/
      application/
      presentation/
  shared/
    domain/                shared value objects and domain errors
    db/                    Prisma client and persistence helpers
    auth/                  session and permission helpers
    ui/                    design system components
    lib/                   pure utilities
  server/
    realtime/              collaboration gateway and event fan-out
    jobs/                  async tasks if needed later
prisma/
  schema.prisma
tests/
  unit/
  integration/
  e2e/
```

## Dependency Rules
- `domain` knows only entities, value objects, policies, and repository interfaces
- `application` orchestrates use cases and depends on domain contracts
- `infrastructure` implements persistence and external adapters
- `presentation` renders UI or maps transport requests to application use cases
- `shared` can be used by modules, but feature modules must not depend on each other's infrastructure directly

- ✅ `presentation -> application -> domain`
- ✅ `infrastructure -> domain`
- ✅ `infrastructure -> shared`
- ❌ `domain -> infrastructure`
- ❌ `domain -> Next.js or Prisma`
- ❌ one feature module importing another module's persistence layer

## Layer/Module Communication
- Cross-module work happens through application services and explicit module contracts
- Shared graph rules live in the `graph` module, not inside UI components
- Route handlers call application services and return transport-safe DTOs
- Realtime updates publish domain events after successful writes

## Key Principles
1. Keep graph invariants on the server, even if the client performs optimistic checks.
2. Model workflow concepts explicitly instead of hiding them in generic task tables.
3. Prefer module APIs over direct deep imports across features.

## Code Examples

### Domain Rule Example
```ts
export class BlockDependencyPolicy {
  static assertNoSelfDependency(blockId: string, dependencyId: string): void {
    if (blockId === dependencyId) {
      throw new Error("A block cannot depend on itself.");
    }
  }
}
```

### Application Service Example
```ts
type CreateBlockInput = {
  projectId: string;
  title: string;
  ownerId: string;
};

export class CreateBlockService {
  constructor(private readonly blocks: BlockRepository) {}

  async execute(input: CreateBlockInput): Promise<Block> {
    const block = Block.create(input);
    await this.blocks.save(block);
    return block;
  }
}
```

### Route Handler Example
```ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const service = makeCreateBlockService();
  const block = await service.execute(body);

  return NextResponse.json({ data: block }, { status: 201 });
}
```

## Anti-Patterns
- ❌ Putting cycle detection, readiness logic, or status propagation only in React components
- ❌ Treating every block as generic JSON without explicit domain rules
- ❌ Sharing Prisma models directly with the UI as product-facing contracts
- ❌ Breaking the app into services before module boundaries are proven in production
