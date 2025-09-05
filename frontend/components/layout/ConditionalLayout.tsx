'use client';

import { useAuth } from '@/context/AuthProvider';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // For login page - simple layout without sidebar/header
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // For authenticated pages - layout with sidebar and header
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: "#f5f4f4" }}>
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}