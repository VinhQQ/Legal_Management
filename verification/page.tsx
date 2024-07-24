'use client';
import React, { useEffect, useState } from 'react';
import { mySignDocs } from './action';
import { TDocument } from '@/Types/Document.type';
import { Button, Space, Table, TableProps } from 'antd';
import StatusTag from '@/components/StatusTag';
import { TUser } from '@/Types/User.type';
import dayjs from 'dayjs';
import Link from 'next/link';

const columns: TableProps<any>['columns'] = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <StatusTag status={status} /> },
  {
    title: 'Upload by',
    dataIndex: 'user_upload',
    key: 'user_upload',
    render: (user: TUser) => user.Profile[0].fullName,
  },
  {
    title: 'Expires',
    dataIndex: 'expires',
    key: 'expires',
    render: (expires: string) => (expires ? dayjs(expires).format('DD/MM/YYYY') : 'All time'),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record: TDocument) => (
      <Space size='middle'>
        <Link href={`/dashboard/documents/verification/${record.id}`}>
          <Button type='primary' size='small'>
            Detail
          </Button>
        </Link>
      </Space>
    ),
  },
];

export default function VerificationDoc() {
  const [documents, setDocuments] = useState<TDocument[]>();

  useEffect(() => {
    const fetchDocuments = async () => {
      const data = await mySignDocs();
      console.log(data);
      setDocuments(data);
    };
    fetchDocuments();
  }, []);

  return (
    <section>
      <h1 className='text-3xl font-medium'>List documents to be verified</h1>
      <Table bordered className='mt-4' columns={columns} dataSource={documents} rowKey='id' />
    </section>
  );
}
