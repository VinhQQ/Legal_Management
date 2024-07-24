'use client';
import { TDocument } from '@/Types/Document.type';
import PDFViewer from '@/components/PDFViewer';
import { InboxOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Upload, UploadProps, message } from 'antd';
import CryptoJS from 'crypto-js';
import { useState } from 'react';

const { Dragger } = Upload;

export default function CheckingModal({
  open,
  setOpen,
  doc,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  doc: TDocument;
}) {
  const [api, contextHolder] = message.useMessage();
  const [hashNew, setHashNew] = useState<string>('');
  const [URLNew, setURLNew] = useState<string | null>(null);
  const [isUpload, setIsUpload] = useState<boolean>(false);

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: 'application/pdf',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        const reader = new FileReader();
        reader.readAsArrayBuffer(info.file.originFileObj as Blob);
        reader.onload = (event) => {
          if (event.target) {
            const fileArrayBuffer = event.target.result as ArrayBuffer;
            const fileUint8Array = new Uint8Array(fileArrayBuffer);
            const file_word_array = CryptoJS.lib.WordArray.create(fileUint8Array);
            const hash = CryptoJS.SHA256(file_word_array).toString();
            console.log('Hash:', hash);
            setHashNew(hash);
          }
        };

        const url = URL.createObjectURL(info.file.originFileObj as Blob);
        setURLNew(url);
        setIsUpload(true);

        api.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        api.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleCancel = () => {
    setURLNew(null);
    setHashNew('');
    setOpen(false);
    setIsUpload(false);
  };

  return (
    <Modal
      centered
      width='70%'
      title='Checking Document'
      open={open}
      onCancel={handleCancel}
      onClose={handleCancel}
      footer={null}
    >
      {contextHolder}
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <h1 className='text-2xl font-medium text-center my-2'>Origin File</h1>
          <div className='h-[70vh]'>
            <PDFViewer url={doc.doc_url} />
          </div>
        </Col>
        <Col span={12}>
          <h1 className='text-2xl font-medium text-center my-2'>File Compare</h1>
          {URLNew ? (
            <div className='h-[70vh]'>
              <PDFViewer url={URLNew} />
            </div>
          ) : (
            <div>
              <Dragger {...props}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                <p className='ant-upload-hint'>
                  Support PDF file only. This file will be checked with the original file to ensure integrity
                </p>
              </Dragger>
            </div>
          )}
        </Col>
      </Row>
      {isUpload && (
        <div className='mt-3'>
          {hashNew !== doc.hash ? (
            <div className='flex justify-center items-center'>
              <p className='text-3xl text-red-500'>Document Integrity: False</p>
            </div>
          ) : (
            <div className='flex justify-center items-center'>
              <p className='text-3xl text-green-500'>Document Integrity: True</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
