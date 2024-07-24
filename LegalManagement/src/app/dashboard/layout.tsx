'use client';
import { DesktopOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Alert, Button, Layout, Menu } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { FaBell, FaHome, FaNewspaper, FaPaperclip } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { VscVerified } from 'react-icons/vsc';
import { signOut } from 'next-auth/react';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Docs storage', 'documents', <FileOutlined />, [
    getItem('All Documents', '/documents/all', <FaNewspaper />),
    getItem('Release new', '/documents/new_release', <FaPaperclip className='inline' />),
    getItem('Sign verification', '/documents/verification', <VscVerified className='inline' />),
  ]),
  getItem('Users & Teams', 'account', <UserOutlined />, [
    getItem('Register User', '/users/new'),
    // getItem('Create Team', '/users/team_create'),
    // getItem('All Users', '/users/all'),
  ]),
  // getItem('Team', 'sub2', <TeamOutlined />, [getItem('My Team', '/teams/my'), getItem('Team 2', '8')]),
  getItem('Settings', 'settings', <DesktopOutlined />, [getItem('Profile', '/settings/profile')]),
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    router.push(`/dashboard${path}`);
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
    });
  };

  return (
    <Layout className='w-full h-screen'>
      <Sider style={{ background: 'white' }}>
        <div className='w-full'>
          <h1 className='text-2xl font-bold h-16 flex items-center justify-center'>LOGO</h1>
        </div>
        <Menu
          onClick={(item) => handleNavigate(item.key as string)}
          theme='light'
          defaultSelectedKeys={[pathname.replace('/dashboard', '')]}
          mode='inline'
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ background: 'white' }} className='flex items-center justify-end'>
          <div className='flex items-center space-x-8'>
            <FaBell size={20} className='cursor-pointer' />
            <Link href='/'>
              <FaHome size={20} />
            </Link>
            <div className='flex items-center space-x-4'>
              <span>{data?.user?.name}</span>
            </div>
            <Button onClick={handleSignOut} type='text' icon={<IoMdLogOut size={20} className='inline' />} />
          </div>
        </Header>
        {!data?.user.fa_secret && status === 'authenticated' && (
          <div className='px-2 pt-1'>
            <Alert
              message={
                <p>
                  Two-factor authentication (2FA) has not been configured! Please access the
                  <Link href='/dashboard/settings/profile'> settings </Link>
                  to complete the advanced authentication setup.
                </p>
              }
              type='warning'
              showIcon
            />
          </div>
        )}
        <Content className='p-2 pr-0'>
          <div className='w-full h-full bg-white rounded-md p-4 overflow-auto'>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
