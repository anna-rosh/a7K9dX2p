import { createContext } from 'react';
import type { User } from '@/types';

export interface UserContextType {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
