import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

let client: PrismaClient

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
if (process.env.NODE_ENV === 'production') {
  client = new PrismaClient({
    adapter,
  })
} else {
  if (!global.client) {
    global.client = new PrismaClient({
      adapter,
    })
  }
  client = global.client
}
export default client