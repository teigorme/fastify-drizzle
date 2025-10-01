import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/drizzle.ts";
import { users } from "../../db/schemas.ts";
import * as z from "zod";
import { eq } from "drizzle-orm";

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/users/:id",
    schema: {
      tags: ["Users"],
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        204: z.null(),
        404: z.null(),
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const [user] = await db.select().from(users).where(eq(users.id, id));

      if (!user) reply.status(404).send();
      await db.delete(users).where(eq(users.id, id));

      reply.status(204).send();
    },
  });
}
