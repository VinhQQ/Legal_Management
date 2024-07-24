import { auth, signOut } from '@/auth';
import { Avatar, Button, Form } from 'antd';
import Link from 'next/link';
import React from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { UserOutlined } from '@ant-design/icons';

export default async function HomePage() {
  const session = await auth();

  const handleSignOut = async () => {
    'use server';
    await signOut();
  };
  return (
    <main
      className='w-full h-screen flex flex-col'
      style={{ background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(135,146,231,1) 100%)' }}
    >
      <nav className='w-full h-20 flex items-center justify-between px-16'>
        <h1 className='text-2xl font-bold'>LOGO</h1>
        <ul className='flex space-x-16 text-xl font-medium ml-20'>
          <Link href='/'>Home</Link>
          <Link href={session?.user ? '/dashboard' : '/auth/login'}>Dashboard</Link>
          <Link href='/'>Information</Link>
        </ul>
        <div className='flex'>
          {session?.user ? (
            <div className='flex items-center space-x-2'>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <h1>{session.user.name}</h1>
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <Button htmlType='submit' type='text' icon={<IoMdLogOut size={20} className='inline' />} />
              </form>
            </div>
          ) : (
            <Link href='/auth/login'>
              <Button icon={<FaRegUserCircle className='inline' />} type='primary' size='large' className='w-24'>
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
      <section className='flex-1 flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-7xl font-bold text-white w-[60%] text-center'>Document management system for business</h1>
          <p className='text-2xl text-white mt-4'>Easily send, sign, and manage all of your contracts in one place.</p>
        </div>
      </section>
    </main>
  );
}
