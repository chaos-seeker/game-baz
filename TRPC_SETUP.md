# tRPC + Prisma + PostgreSQL Setup

این پروژه با tRPC، Prisma و PostgreSQL راه‌اندازی شده است.

## تنظیمات اولیه

1. **تنظیم Database URL:**
   - فایل `.env` را ایجاد کنید و `DATABASE_URL` را تنظیم کنید:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/gamebaz?schema=public"
   ```

2. **ایجاد Schema در Prisma:**
   - فایل `prisma/schema.prisma` را ویرایش کنید و مدل‌های خود را اضافه کنید
   - مثال:
   ```prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     name      String?
     createdAt DateTime @default(now())
   }
   ```

3. **اجرای Migration:**
   ```bash
   pnpm db:migrate
   ```

4. **Generate Prisma Client:**
   ```bash
   pnpm db:generate
   ```

## استفاده از tRPC

### در Server (Router):

```typescript
// server/routers/_app.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const appRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
    }),
  
  createUser: publicProcedure
    .input(z.object({ email: z.string().email(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.create({
        data: input,
      });
    }),
});
```

### در Client (React Component):

```typescript
'use client';

import { trpc } from '@/utils/trpc';

export const MyComponent = () => {
  const { data, isLoading } = trpc.getUser.useQuery({ id: '123' });
  const createUser = trpc.createUser.useMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>{data?.name}</p>
      <button onClick={() => createUser.mutate({ email: 'test@test.com', name: 'Test' })}>
        Create User
      </button>
    </div>
  );
};
```

## Scripts موجود

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio

## ساختار فایل‌ها

```
game-baz/
├── server/
│   ├── trpc.ts              # tRPC context و setup
│   └── routers/
│       └── _app.ts          # Root router
├── app/
│   └── api/
│       └── trpc/
│           └── [trpc]/
│               └── route.ts # API route handler
├── utils/
│   └── trpc.ts              # tRPC client setup
├── lib/
│   └── prisma.ts            # Prisma client instance
└── prisma/
    └── schema.prisma        # Prisma schema

