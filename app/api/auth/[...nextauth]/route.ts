import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import client from "@/lib/db";

const handler = NextAuth({

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await client.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          // create new user
          const hashed = credentials.password

          const newUser = await client.user.create({
            data: {
              email: credentials.email,
              password: hashed,
              provider:"Crediantials"
            },
          });

          return {
            id: newUser.id,
            email: newUser.email,
          };
        }

        // verify password
        const valid = (credentials.password == user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
