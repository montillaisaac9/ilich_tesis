// app/api/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { DefaultSession } from 'next-auth'; // Importación añadida

declare module "next-auth" {
  interface User {
    area?: string;
  }
  
  interface Session {
    user: {
      area?: string;
    } & DefaultSession["user"];
  }
}

async function authenticateUser(username: string, password: string) {
  // Implementa tu lógica real de autenticación aquí
  if (username === 'admin' && password === 'admin') {
    return {
      id: '1',
      username: 'admin',
      area: 'gerencia'
    };
  }
  return null;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await authenticateUser(
          credentials.username as string,
          credentials.password as string
        );

        return user ? {
          id: user.id,
          name: user.username,
          area: user.area
        } : null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.area) {
        token.area = user.area;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.area) {
        session.user.area = token.area as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});