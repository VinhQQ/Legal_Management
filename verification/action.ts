'use server';
import prisma from '@/libs/prisma';
import { auth } from '@/auth';
import { authenticator } from 'otplib';

export const mySignDocs = async () => {
  const session = await auth();
  const documents = await prisma.document.findMany({
    where: {
      user_sign_id: session!.user.id,
    },
    include: {
      user_sign: {
        include: {
          Profile: true,
        },
      },
      user_upload: {
        include: {
          Profile: true,
        },
      },
    },
  });

  return documents;
};

export const getDocById = async (id: string) => {
  const doc = await prisma.document.findUnique({
    where: {
      id,
    },
    include: {
      user_sign: {
        include: {
          Profile: true,
        },
      },
      user_upload: {
        include: {
          Profile: true,
        },
      },
    },
  });

  return doc;
};

export const signDoc = async (id: string, token2FA: string) => {
  const session = await auth();

  if (!session?.user.fa_secret) {
    throw new Error('Please enable 2FA');
  }

  const isValid = authenticator.verify({ token: token2FA, secret: session?.user.fa_secret });

  if (!isValid) {
    throw new Error('Invalid 2FA token');
  }

  const doc = await prisma.document.findUnique({
    where: {
      id,
    },
  });

  if (doc?.is_signed) {
    throw new Error('Document already signed');
  }

  if (doc?.user_upload_id === session!.user.id) {
    throw new Error('You cannot sign your own document');
  }

  const update = await prisma.document.update({
    where: {
      id,
    },
    data: {
      is_signed: true,
      status: 'Signed',
      sign_date: new Date(),
    },
  });

  return update;
};
