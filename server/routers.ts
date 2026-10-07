import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { importMaterials } from "./materialImport";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  materialImport: router({
    // 외부 사이트에서 자재 정보를 가져온다. 지원 사이트/요청 간격/동시 실행 제한은 materialImport.ts 참고.
    fetch: publicProcedure
      .input(z.object({ url: z.string().min(1).max(2000), limit: z.number().int().min(1).max(20).default(10) }))
      .mutation(({ input }) => importMaterials(input.url, input.limit)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
