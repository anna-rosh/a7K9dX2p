import { useState, type ReactNode } from 'react';
import type { User } from '@/types';
import { mockUsers } from '@/constants/users';
import { UserContext } from './user-context';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  return (
    <UserContext.Provider
      value={{ currentUser, users: mockUsers, setCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
