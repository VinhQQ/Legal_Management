'use client';
import { TDocument } from '@/Types/Document.type';
import React, { useEffect, useState } from 'react';
import { getDocById, signDoc } from '../action';
import { Button, Col, Descriptions, DescriptionsProps, Divider, Input, Modal, Row, Spin, notification } from 'antd';
import PDFViewer from '@/components/PDFViewer';
import dayjs from 'dayjs';
import { FaSignature, FaStamp } from 'react-icons/fa';
import { PiStampDuotone } from 'react-icons/pi';

const ItemRender = (doc: TDocument) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 0,
      span: 24,
      labelStyle: { fontWeight: 'bold' },
      label: 'Document ID',
      children: doc?.id,
    },
    {
      key: 1,
      span: 24,
      label: 'Upload By',
      children: doc?.user_upload.Profile[0].fullName,
    },
    {
      key: 2,
      span: 24,
      label: 'Created At',
      children: dayjs(doc?.createdAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      key: 3,
      span: 24,
      label: 'Signer',
      children: doc?.user_sign.Profile[0].fullName,
    },
    {
      key: 4,
      span: 24,
      label: 'Status',
      children: doc?.status,
    },
    {
      key: 5,
      span: 24,
      label: 'Is Sign',
      children: doc?.is_signed ? 'Yes' : 'No',
    },
    {
      key: 6,
      span: 24,
      label: 'Sign At',
      children: doc?.sign_date ? dayjs(doc?.sign_date).format('DD/MM/YYYY hh:mm') : 'Not Signed Yet',
    },
    {
      key: 7,
      span: 24,
      label: 'Contract validity period',
      children: doc?.expires
        ? `${dayjs(doc.sign_date).format('DD/MM/YYYY hh:mm')} - ${dayjs(doc.expires).format('DD/MM/YYYY hh:mm')}`
        : 'All time',
    },
  ];
  return items;
};

export default function VerificationDocDetail({ params }: { params: { id: string } }) {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [doc, setDoc] = useState<TDocument | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [reload, setReload] = useState<boolean>(false);

  const handleSignDoc = async () => {
    try {
      const sign = await signDoc(params.id, otp);
      console.log(sign);
      setOpen(false);
      api.success({
        message: 'Document signed successfully',
      });
      setReload(!reload);
    } catch (error: any) {
      api.error({
        message: 'Failed to sign document',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchDoc = async () => {
      const data = await getDocById(params.id);
      setDoc(data);
    };
    fetchDoc();
    setLoading(false);
  }, [params.id, reload]);
  return (
    <section>
      {contextHolder}
      {doc ? (
        <Row gutter={[30, 30]}>
          <Col span={12} className='sticky top-0 h-[85vh]'>
            <PDFViewer url={doc?.doc_url!} />
            {doc.is_signed && (
              <div className='absolute bottom-10 right-20'>
                <FaSignature size={100} color='green' />
                <p className='font-medium text-xl text-green-600'>Signed by {doc.user_sign.Profile[0].fullName}</p>
              </div>
            )}
          </Col>
          <Col span={12}>
            <h1 className='text-3xl font-semibold'>{doc.title}</h1>
            <p>{doc?.desc}</p>
            <Divider />
            <Descriptions bordered items={ItemRender(doc)} />
            {doc.is_signed ? null : (
              <Button onClick={() => setOpen(true)} type='primary' className='mt-4 w-full' size='large'>
                SIGN TO DOCUMENTS
              </Button>
            )}
          </Col>
          <Modal footer={null} centered open={open} onCancel={() => setOpen(false)}>
            <div className='flex flex-col items-center space-y-3'>
              <h1 className='text-2xl font-semibold'>Sign Document</h1>
              <p>Enter your 2FA token to sign the document</p>
              <Input.OTP autoFocus onChange={setOtp} value={otp} />
              <Button onClick={handleSignDoc} type='primary' className='mt-4'>
                Sign Document
              </Button>
            </div>
          </Modal>
        </Row>
      ) : (
        <div className='flex flex-col space-y-3 items-center justify-center w-full h-[90vh]'>
          <Spin />
          <p>Loading ...</p>
        </div>
      )}
    </section>
  );
}
