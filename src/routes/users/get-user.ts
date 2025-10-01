import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/drizzle.ts";
import { users } from "../../db/schemas.ts";
import * as z from "zod";
import { eq } from "drizzle-orm";

export async function getUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/users/:id",
    schema: {
      tags: ["Users"],
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          id: z.uuid(),
          fullName: z.string(),
          phone: z.string(),
          address: z.string(),
          score: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
        404: z.null(),
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;

      const [user] = await db.select().from(users).where(eq(users.id, id));

      if (!user) reply.status(404).send();

      reply.status(200).send(user);
    },
  });
}
