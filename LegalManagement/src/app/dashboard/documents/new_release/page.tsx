'use client';
import { TDocument } from '@/Types/Document.type';
import { InboxOutlined } from '@ant-design/icons';
import { Prisma } from '@prisma/client';
import type { UploadProps } from 'antd';
import { Button, Divider, Form, Input, Select, Upload, message } from 'antd';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { createDocument, getAllUser } from './action';

const { Dragger } = Upload;

type TUser = Prisma.UserGetPayload<{
  include: {
    Profile: true;
  };
}>;

type UploadDocument = TDocument & { scope: string };

export default function NewRelease() {
  const [api, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<TUser[]>([]);
  const [fileHash, setFileHash] = useState<string>('');
  const [urlFile, setUrlFile] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const data = await getAllUser();
      setUsers(data);
    };
    fetchUser();
    setLoading(false);
  }, []);

  const UserSelectOption = (users: TUser[]) =>
    users.map((user) => ({ label: `${user.Profile[0].fullName} - ${user.company_role}`, value: user.id }));

  const getScopeOption = () => [{ label: 'All System', value: 'all' }];

  const handleCreateDocument = async (values: UploadDocument) => {
    setLoading(true);
    values.doc_url = urlFile as string;
    values.hash = fileHash;
    console.log(values);
    try {
      await createDocument(values);
      api.success('Document created successfully');
    } catch (error) {
      console.error(error);
      api.error('Failed to create document');
    }
    setLoading(false);
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: process.env.NEXT_PUBLIC_UPLOAD_URL,
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
            setFileHash(hash);
          }
        };

        api.success(`${info.file.name} file uploaded successfully.`);
        setUrlFile(info.file.response.url);
      } else if (status === 'error') {
        api.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <section>
      {contextHolder}
      <header className='p-2 space-y-2'>
        <h1 className='text-3xl font-medium'>Upload new Documents Release</h1>
        <h3 className='text-gray-500'>Upload new documents to the system</h3>
      </header>
      <Divider />
      <Dragger {...props}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Click or drag file to this area to upload</p>
        <p className='ant-upload-hint'>
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
        </p>
      </Dragger>
      <Form
        initialValues={{
          scope: 'all',
        }}
        onFinish={handleCreateDocument}
        labelCol={{ span: 3 }}
        labelAlign='left'
      >
        <div className='mt-6'>
          <h2 className='text-xl font-medium'>Document Information:</h2>
          <div className='mt-8'>
            <Form.Item
              label='Document Title'
              name='title'
              rules={[
                {
                  required: true,
                  message: 'Please input your document title!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Document Description'
              name='desc'
              rules={[
                {
                  required: true,
                  message: 'Please input your document description!',
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label='Release scope'
              name='scope'
              rules={[
                {
                  required: true,
                  message: 'Please select release scope!',
                },
              ]}
            >
              <Select options={getScopeOption()} />
            </Form.Item>
            <Divider />
            <h2 className='text-xl font-medium mb-6'>Signer Information:</h2>
            <Form.Item
              layout='vertical'
              label='Signer:'
              name='user_sign_id'
              rules={[
                {
                  required: true,
                  message: 'Please select signer!',
                },
              ]}
            >
              <Select loading={loading} options={UserSelectOption(users)} />
            </Form.Item>
          </div>
          <div className='flex justify-end pt-8'>
            <Button disabled={!urlFile || loading} loading={loading} htmlType='submit' type='primary'>
              Upload Release
            </Button>
          </div>
        </div>
      </Form>
    </section>
  );
}
