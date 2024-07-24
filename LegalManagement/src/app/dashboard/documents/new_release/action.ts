'use server';
import { TDocument } from '@/Types/Document.type';
import { auth } from '@/auth';
import prisma from '@/libs/prisma';
export const getAllUser = async () => {
  const user = await prisma.user.findMany({
    include: {
      Profile: true,
    },
  });
  return user;
};

export const createDocument = async (data: TDocument & { scope: string }) => {
  const session = await auth();
  const document = await prisma.document.create({
    data: {
      title: data.title,
      desc: data.desc,
      doc_url: data.doc_url,
      team_id: data.scope === 'all' ? null : data.scope,
      user_sign: {
        connect: {
          id: data.user_sign_id,
        },
      },
      user_upload: {
        connect: {
          id: session!.user.id,
        },
      },
      hash: data.hash,
    },
  });

  return document;
};
