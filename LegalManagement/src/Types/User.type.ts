import { Prisma } from '@prisma/client';

export type TProfile = Prisma.ProfileGetPayload<{}>;

export type TUser = Prisma.UserGetPayload<{
  include: {
    Profile: true;
  };
}>;

export type UserCreate = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  bio?: string;
  company_role: string;
};
