import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/drizzle.ts";
import { users } from "../../db/schemas.ts";
import * as z from "zod";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/users",
    schema: {
      tags: ["Users"],
      body: z.object({
        fullName: z.string(),
        phone: z.string(),
        address: z.string(),
        score: z.number(),
      }),
      response: {
        201: z.object({
          id: z.uuid(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { fullName, address, phone, score } = request.body;

      const [user] = await db
        .insert(users)
        .values({ fullName, address, phone, score })
        .returning({
          id: users.id,
        });

      reply.status(201).send(user);
    },
  });
}
