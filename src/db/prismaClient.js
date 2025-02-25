import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data?.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
      async update({ args, query }) {
        if (args.data?.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
      async upsert({ args, query }) {
        if (args.create?.password) {
          args.create.password = await bcrypt.hash(args.create.password, 10);
        }
        if (args.update?.password) {
          args.update.password = await bcrypt.hash(args.update.password, 10);
        }
        return query(args);
      },
    },
  },
  model: {
    user: {
      // Custom Method to Sign JWT
      async generateJWT(user) {
        const token = jwt.sign(
          { userId: user.id, email: user.email, fullname: user.fullname },
          process.env.ACCESS_TOKEN_SECRET, // Ensure this is set in your .env
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
        return token;
      },
    },
  },
});

export default prisma;
