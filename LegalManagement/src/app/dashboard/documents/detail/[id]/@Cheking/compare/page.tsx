'use client';
import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckingModal() {
  const router = useRouter();

  return (
    <Modal
      title='Basic Modal'
      open={true}
      onOk={() => router.push('/dashboard/documents/detail/clxn2980v0002sb5wycv4r9b6')}
      onCancel={() => router.push('/dashboard/documents/detail/clxn2980v0002sb5wycv4r9b6')}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}
