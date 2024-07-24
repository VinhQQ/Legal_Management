'use server';

import { UserCreate } from '@/Types/User.type';
import prisma from '@/libs/prisma';
import bcrypt from 'bcryptjs';

export const createUser = async (data: UserCreate) => {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      company_role: data.company_role,
      password: bcrypt.hashSync(data.password, 10),
      Profile: {
        create: {
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
        },
      },
    },
  });

  return user;
};
