import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// this is the file which handles and checks for database connectivity if some error occurs
// we simply exit from here only

async function init() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to database");
  } catch (err) {
    console.log(`an error occured while connection to db ${err}`);
    process.exit(1);
  }
}

export default init;
