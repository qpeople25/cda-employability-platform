import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Employability Coach Platform',
  description: 'CDA Employability Coaching and Assessment Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-primary text-white border-b">
          <div className="container mx-auto py-4 flex items-center justify-between">
            <Link href="/participants">
              <h1 className="text-xl font-bold cursor-pointer hover:opacity-90">
                CDA Employability Coach Platform
              </h1>
            </Link>
            <Link href="/admin/login">
              <button className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors">
                Admin
              </button>
            </Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
