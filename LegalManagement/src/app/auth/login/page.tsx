'use client';
import { Button, Form, Input, notification } from 'antd';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { handleSignIn } from './action';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await handleSignIn(values);
      window.location.href = '/dashboard';
    } catch (error: any) {
      api.error({
        message: error.message,
        description: 'Please try again',
      });
    }
    setLoading(false);
  };

  return (
    <div className='w-full h-screen'>
      {contextHolder}
      <div className='flex justify-center items-center h-full'>
        <Form
          className='w-96'
          name='login'
          initialValues={{ remember: true }}
          onFinish={(values) => handleLogin(values)}
        >
          <Form.Item name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder='Email' />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder='Password' />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} disabled={loading} type='primary' htmlType='submit' block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
