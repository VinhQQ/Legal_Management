'use server';

import prisma from '@/libs/prisma';

export const getAllDocs = async (page: number, limit: number) => {
  const docs = await prisma.document.findMany({
    where: {
      teams: {
        none: {},
      },
    },
    take: limit,
    skip: (page - 1) * limit,
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

  const total = await prisma.document.count({
    where: {
      teams: {
        none: {},
      },
    },
  });

  return { docs, total };
};

export const searchDocs = async (query: string) => {
  const docs = await prisma.document.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          user_upload: {
            Profile: {
              some: {
                fullName: {
                  contains: query,
                },
              },
            },
          },
        },
        {
          user_sign: {
            Profile: {
              some: {
                fullName: {
                  contains: query,
                },
              },
            },
          },
        },
      ],
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

  const total = await prisma.document.count({
    where: {
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          user_upload: {
            Profile: {
              some: {
                fullName: {
                  contains: query,
                },
              },
            },
          },
        },
        {
          user_sign: {
            Profile: {
              some: {
                fullName: {
                  contains: query,
                },
              },
            },
          },
        },
      ],
    },
  });

  return { docs, total };
};
