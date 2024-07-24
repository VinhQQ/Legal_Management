/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { TDocument } from '@/Types/Document.type';
import PDFViewer from '@/components/PDFViewer';
import { Button, Col, Descriptions, DescriptionsProps, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import CheckingModal from './CheckingModal';
import { getDoc } from './action';
import { FaSignature } from 'react-icons/fa';

export default function DetailDocument({ params }: { params: { id: string } }) {
  const [doc, setDoc] = useState<TDocument | null>(null);
  const [checkModal, setCheckModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoc = async () => {
      const data = await getDoc(params.id);
      setDoc(data);
    };
    fetchDoc();
  }, [params.id]);

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

  return (
    <section>
      {doc && (
        <Row gutter={[30, 30]} className='relative'>
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
            <div className='flex flex-col space-y-4'>
              <h1 className='text-3xl font-semibold'>{doc?.title}</h1>
              <p>{doc?.desc}</p>
              <Divider />
              <Descriptions bordered title='Document information' items={ItemRender(doc)} />
            </div>
            <Button onClick={() => setCheckModal(true)} className='mt-8 w-full' size='large' type='primary'>
              Check document integrity
            </Button>
          </Col>
          <CheckingModal doc={doc!} open={checkModal} setOpen={setCheckModal} />
        </Row>
      )}
    </section>
  );
}
