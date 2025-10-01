import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/drizzle.ts";
import { users } from "../../db/schemas.ts";
import * as z from "zod";
import { eq } from "drizzle-orm";

export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/users/:id",
    schema: {
      tags: ["Users"],
      params: z.object({
        id: z.uuid(),
      }),
      body: z.object({
        fullName: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        score: z.number().optional(),
      }),
      response: {
        200: z.null(),
        404: z.null(),
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;

      const { fullName, address, phone, score } = request.body;

      const [user] = await db
        .update(users)
        .set({ fullName, address, phone, score })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
        });

      if (!user) reply.status(404).send();

      reply.status(200).send();
    },
  });
}
