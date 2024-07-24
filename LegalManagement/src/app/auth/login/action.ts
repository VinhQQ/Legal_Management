'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export const handleSignIn = async (value: { email: string; password: string }) => {
  try {
    await signIn('credentials', {
      email: value.email,
      password: value.password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CallbackRouteError':
          throw new Error('Email or password is incorrect');
        default:
          throw new Error('Something went wrong');
      }
    }
  }
};
