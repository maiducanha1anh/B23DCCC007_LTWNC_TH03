import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { USERS } from "@/data/users";
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Bài thực hành chạy trực tiếp trên localhost, không qua reverse proxy.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize(credentials) {
        const user = USERS.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password,
        );
        return user
          ? { id: user.id, name: user.name, email: user.email, role: user.role }
          : null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});
