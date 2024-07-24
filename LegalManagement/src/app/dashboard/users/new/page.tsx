'use client';

import { UserCreate } from '@/Types/User.type';
import { Button, Divider, Form, Input, Select, message } from 'antd';
import React from 'react';
import { createUser } from './action';

export default function RegisterUser() {
  const [form] = Form.useForm();
  const [api, contextHolder] = message.useMessage();
  const handleCreateUser = async (values: UserCreate) => {
    try {
      const user = await createUser(values);
      form.resetFields();
      api.success('User created successfully');
    } catch (error) {
      console.error(error);
      api.error('User created failed');
    }
  };

  return (
    <section>
      {contextHolder}
      <header className='p-2 space-y-2'>
        <h1 className='text-3xl font-medium'>Create employee accounts</h1>
        <h3 className='text-gray-500'>
          Create new employee accounts to the system. You can create a new account by filling in the form below.
        </h3>
      </header>
      <Divider />
      <Form
        onFinish={handleCreateUser}
        initialValues={{ company_role: 'staff' }}
        form={form}
        labelCol={{ span: 3 }}
        labelAlign='left'
      >
        <h1 className='text-xl font-medium my-4'>Information Employee</h1>
        <Form.Item
          label='Full Name'
          name='fullName'
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Phone Number'
          name='phone'
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Address'
          name='address'
          rules={[
            {
              required: true,
              message: 'Please input your address!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Bio Info' name='bio'>
          <Input />
        </Form.Item>
        <Divider />
        <h1 className='text-xl font-medium my-4'>Account Information</h1>
        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              min: 6,
              message: 'Password must be at least 6 characters',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='Confirm Password'
          name='confirmPassword'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              validator: (_, value) => {
                if (!value || value === form.getFieldValue('password')) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='Position'
          name='company_role'
          rules={[
            {
              required: true,
              message: 'Please input your position in company!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <div className='flex items-center justify-end'>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </div>
      </Form>
    </section>
  );
}
