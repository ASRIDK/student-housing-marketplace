// Loads the mock listings into the database so everyone sees the same
// data. Safe to run again: it upserts by id.
//
//   npm run db:seed

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import { mockListings } from "../src/lib/mock-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set — copy .env.example to .env.local");
}

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

async function main() {
  for (const listing of mockListings) {
    await prisma.user.upsert({
      where: { id: listing.ownerId },
      update: { name: listing.ownerName, email: listing.ownerEmail },
      create: { id: listing.ownerId, name: listing.ownerName, email: listing.ownerEmail },
    });

    const data = {
      ownerId: listing.ownerId,
      city: listing.city,
      neighbourhood: listing.neighbourhood,
      rent: listing.rent,
      currency: listing.currency,
      availableFrom: new Date(listing.availableFrom),
      availableUntil: listing.availableUntil ? new Date(listing.availableUntil) : null,
      rooms: listing.rooms,
      description: listing.description,
      photos: listing.photos,
      status: listing.status,
      createdAt: new Date(listing.createdAt),
    };

    await prisma.listing.upsert({
      where: { id: listing.id },
      update: data,
      create: { id: listing.id, ...data },
    });
  }

  const [users, listings] = await Promise.all([prisma.user.count(), prisma.listing.count()]);
  console.log(`Seeded ${users} users and ${listings} listings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
