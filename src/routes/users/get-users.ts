import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/drizzle.ts";
import { users } from "../../db/schemas.ts";
import * as z from "zod";

export async function getUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/users",
    schema: {
      tags: ["Users"],
      response: {
        200: z
          .object({
            id: z.uuid(),
            fullName: z.string(),
            phone: z.string(),
            address: z.string(),
            score: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
          })
          .array(),
      },
    },
    handler: async (request, reply) => {
      reply.status(200).send(await db.select().from(users));
    },
  });
}
