'use server';

import prisma from '@/libs/prisma';
import { auth } from '@/auth';
import { authenticator, totp } from 'otplib';

export const getUserProfile = async () => {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const userProfile = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      Profile: true,
    },
  });

  return userProfile;
};

export const createKey2FA = async () => {
  const session = await auth();
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(session?.user.email!, 'Docs Sign', secret);
  return { secret, otpauth };
};

export const firstVerify2FA = async (token: string, secret: string) => {
  const isValid = authenticator.verify({ token, secret });
  return isValid;
};

export const saveKey2FA = async (secret: string) => {
  const session = await auth();
  await prisma.user.update({
    where: {
      id: session!.user.id,
    },
    data: {
      fa_secret: secret,
    },
  });

  return true;
};
