import React from 'react';
import { Tag } from 'antd';

export default function StatusTag({ status }: { status: string }) {
  const statusColor: { [key: string]: string } = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  };

  return <Tag color={statusColor[status]}>{status}</Tag>;
}
