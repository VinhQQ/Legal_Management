'use client';

import { TUser } from '@/Types/User.type';
import StatusTag from '@/components/StatusTag';
import { Prisma } from '@prisma/client';
import { Button, Divider, Input, Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllDocs, searchDocs } from './action';

type TTableDocs = Prisma.DocumentGetPayload<{
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

const columns: TableProps<TTableDocs>['columns'] = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <StatusTag status={status} />,
  },
  {
    title: 'Upload By',
    dataIndex: 'user_upload',
    key: 'user_upload',
    render: (user: TUser) => user.Profile[0].fullName,
  },
  { title: 'Signer', dataIndex: 'user_sign', key: 'user_sign', render: (user: TUser) => user.Profile[0].fullName },
  {
    title: 'Is Signed',
    dataIndex: 'is_signed',
    key: 'is_signed',
    render: (is_signed) => (is_signed ? 'Signed' : 'Waiting to sign'),
  },
  {
    title: 'Create At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) => dayjs(date).format('DD/MM/YYYY hh:mm'),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <div className='flex space-x-2'>
        <Link href={`/dashboard/documents/detail/${record.id}`}>
          <Button type='primary' size='small'>
            Detail
          </Button>
        </Link>
      </div>
    ),
  },
];

export default function AllDocuments() {
  const [docs, setDocs] = useState<TTableDocs[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    const fetchDocs = async () => {
      const res = await getAllDocs(page, 10);
      setDocs(res.docs);
      setTotal(res.total);
    };
    fetchDocs();
    setLoading(false);
  }, [page]);

  const handleSearch = async (value: string) => {
    setLoading(true);
    const res = await searchDocs(value);
    setDocs(res.docs);
    setTotal(res.total);
    setLoading(false);
  };

  return (
    <section>
      <header className='p-2 space-y-2'>
        <h1 className='text-3xl font-medium'>All Documents</h1>
        <h3 className='text-gray-500'>All documents are available to you</h3>
      </header>
      <Divider />
      <Input.Search
        onChange={(e) => handleSearch(e.target.value)}
        className='mb-4'
        placeholder='Search by Title, User Sign, Upload'
      />
      <Table
        pagination={{
          defaultCurrent: page,
          defaultPageSize: 10,
          total: total,
          onChange: (page) => setPage(page),
        }}
        loading={loading}
        bordered
        columns={columns}
        dataSource={docs}
        key={'id'}
      />
    </section>
  );
}
