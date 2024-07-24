'use server';

import prisma from '@/libs/prisma';

export const getDoc = async (id: string) =>
  await prisma.document.findUnique({
    where: {
      id: id,
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
