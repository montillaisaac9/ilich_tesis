import "next-auth";

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