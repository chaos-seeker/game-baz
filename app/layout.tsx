import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { PropsWithChildren } from 'react';

const iransansx = localFont({
  src: '../public/fonts/iransansx/IRANSansXV.woff2',
  variable: '--font-iransans',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'گیم باز',
  description: 'توسعه دهنده : حمید شاهسونی',
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={iransansx.className}>{props.children}</body>
    </html>
  );
}
