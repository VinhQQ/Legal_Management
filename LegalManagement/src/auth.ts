import bcrypt from 'bcryptjs';
import NextAuth, { type DefaultSession } from 'next-auth';
import { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import prisma from './libs/prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
      company_role: string;
      fa_secret: string;
    } & DefaultSession['user'];
  }
}

const providers: Provider<any>[] = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      const data = await prisma.user.findFirst({
        where: {
          email: credentials.email!,
        },
        include: {
          Profile: true,
        },
      });

      if (!data || !bcrypt.compareSync(credentials.password as string, data.password)) {
        throw new Error('Email or password is incorrect');
      }

      const user = {
        id: data.id,
        email: data.email,
        name: data.Profile[0].fullName,
        role: data.role,
        company_role: data.company_role,
        fa_secret: data.fa_secret,
      };

      return user;
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  trustHost: true,
  callbacks: {
    jwt({ token, user, trigger, session }: { token: any; user: any; trigger?: string; session?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.company_role = user.company_role;
        token.fa_secret = user.fa_secret;
      }
      if (trigger === 'update' && session?.fa_secret) {
        token.fa_secret = session.fa_secret;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.company_role = token.company_role as string;
      session.user.fa_secret = token.fa_secret as string;

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});
