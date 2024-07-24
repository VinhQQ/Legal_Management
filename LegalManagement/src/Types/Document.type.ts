import { Prisma } from '@prisma/client';
// import { User } from './User.type';

// export type Document = {
//   id: string;
//   title: string;
//   desc: string;
//   doc_url: string;
//   status: string;
//   is_signed: boolean;
//   hash: string;
//   sign_code: string;
//   sign_date: string;
//   expires: string;
//   user_upload: User;
//   user_sign: User;
//   createdAt: string;
//   updatedAt: string;
// };

export type TDocument = Prisma.DocumentGetPayload<{
  include: {
    user_sign: {
      include: {
        Profile: true;
      };
    };
    user_upload: {
      include: {
        Profile: true;
      };
    };
  };
}>;
