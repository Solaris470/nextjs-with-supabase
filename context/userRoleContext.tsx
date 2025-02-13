import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserRole } from '@/utils/supabase/fetchUserRole';

interface UserRoleContextProps {
  role: string | null;
  loading: boolean;
}

const UserRoleContext = createContext<UserRoleContextProps>({ role: null, loading: true });

export const UserRoleProvider = ({ userId, children }: { userId: string; children: React.ReactNode }): JSX.Element => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserRole() {
      const fetchedRole = await fetchUserRole(userId);
      setRole(fetchedRole);
      setLoading(false);
    }

    getUserRole();
  }, [userId]);

  return (
    <UserRoleContext.Provider value={{ role, loading }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);