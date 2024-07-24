import '@/styles/globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Document Manager',
  description: 'Document Manager is a document management system for your business.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi'>
      <SessionProvider>
        <AntdRegistry>
          <body className={inter.className}>{children}</body>
        </AntdRegistry>
      </SessionProvider>
    </html>
  );
}
