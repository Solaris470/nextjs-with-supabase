'use client';

import { ReactNode } from 'react';
import { UserRoleProvider } from '@/context/userRoleContext';

export default function ClientLayout({ userId, children }: { userId: string, children: ReactNode }) {
  return (
    <UserRoleProvider userId={userId}>
      {children}
    </UserRoleProvider>
  );
}