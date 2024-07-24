'use client';
import { TUser } from '@/Types/User.type';
import { UserOutlined } from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Input,
  Modal,
  QRCode,
  Result,
  Spin,
  message,
} from 'antd';
import { Dispatch, useEffect, useState } from 'react';
import { createKey2FA, firstVerify2FA, getUserProfile, saveKey2FA } from './action';
import { useSession } from 'next-auth/react';

const renderItems = (data: TUser) => {
  const items: DescriptionsProps['items'] = [
    { key: 0, label: 'Full Name', children: data?.Profile[0].fullName },
    { key: 1, label: 'Email', children: data?.email },
    { key: 3, label: 'Phone Number', children: data?.Profile[0].phone },
    { key: 4, label: 'Address', children: data?.Profile[0].address || 'N/A' },
    { key: 6, label: 'Company Role', children: data?.company_role },
    { key: 7, label: 'Role', children: data?.role },
  ];
  return items;
};

export default function ProfileSetting() {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const data = await getUserProfile();
      console.log(data);
      setUser(data);
    };
    fetchUser();
    setLoading(false);
  }, []);

  return (
    <section>
      <h1 className='text-3xl font-medium'>My Account</h1>
      <Divider />
      {user ? (
        <div className='mx-auto w-[100vh] h-[30vh] flex flex-col items-center'>
          <div className='flex flex-col items-center'>
            <Avatar size={100} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            <h1 className='mt-2 text-2xl font-medium'>
              {user.Profile[0].fullName} - {user.company_role}
            </h1>
            <h3 className='text-gray-400'>{user.email}</h3>
          </div>
          <div className='mt-4 w-full'>
            <Descriptions bordered layout='vertical' items={renderItems(user)} />
          </div>
          {!user.fa_secret && (
            <div className='mt-4 w-full'>
              <Alert
                message='This account is not enabled 2FA yet!'
                description='You can enable 2FA to secure your account in here.'
                type='warning'
                showIcon
              />
              <Button onClick={() => setOpen(true)} className='w-full mt-3' size='large' type='primary' danger>
                Enable 2FA with Google Authentication
              </Button>
            </div>
          )}
          <Modal2FA data={user} open={open} setOpen={setOpen} />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center w-full h-[60vh]'>
          <Spin />
          <p>Loading ...</p>
        </div>
      )}
    </section>
  );
}

const Modal2FA = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  data: TUser;
}) => {
  type Step = 'QR' | 'Verify' | 'Done';
  const { update } = useSession();
  const [api, contextHolder] = message.useMessage();
  const [step, setStep] = useState<Step>('QR');
  const [token, setToken] = useState<string>('');
  const [qrString, setQRString] = useState<{ otpauth: string; secret: string } | undefined>(undefined);

  const getQRString = async () => {
    const { otpauth, secret } = await createKey2FA();
    setQRString({ otpauth, secret });
  };

  const handleVerify = async () => {
    const isValid = await firstVerify2FA(token, qrString?.secret!);
    if (isValid) {
      await saveKey2FA(qrString?.secret!);
      await update({ fa_secret: qrString?.secret! });
      api.success('2FA has been enabled successfully!');
      setStep('Done');
    } else {
      api.error('Invalid code! Please try again.');
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setStep('QR');
    if (step === 'Done') {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (step === 'QR') {
      getQRString();
    }
  }, [step]);

  return (
    <Modal
      title='Enable 2FA with Google Authentication'
      centered
      open={open}
      footer={null}
      onCancel={handleCancel}
      onOk={handleCancel}
    >
      <section>
        {contextHolder}
        {step === 'QR' && (
          <div className='flex flex-col items-center'>
            <p>Scan this QR Code with Google Authenticator</p>
            <QRCode value={qrString?.otpauth || ''} />
            <Button onClick={() => setStep('Verify')} className='mt-3' type='primary'>
              Next
            </Button>
          </div>
        )}
        {step === 'Verify' && (
          <div className='flex flex-col items-center'>
            <p className='mb-4'>Enter the code from Google Authenticator</p>
            <Input.OTP autoFocus value={token} onChange={(code) => setToken(code)} />
            <Button onClick={handleVerify} className='mt-3' type='primary'>
              Verify
            </Button>
          </div>
        )}
        {step === 'Done' && (
          <Result
            status='success'
            title='2FA has been enabled successfully!'
            subTitle='You can now secure your account with Google Authenticator.'
          />
        )}
      </section>
    </Modal>
  );
};
