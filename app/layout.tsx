import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '26AS Design Studio - Architecture & Design',
  description: 'Modern architecture and design studio creating exceptional spaces',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}