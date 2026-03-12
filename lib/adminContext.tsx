'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from './types';

const SESSION_KEY = 'dsp_current_user';

function readPersistedUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

interface AdminContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  // Initialise from sessionStorage so refreshes keep the user logged in
  const [currentUser, _setCurrentUser] = useState<User | null>(readPersistedUser);

  const setCurrentUser = useCallback((user: User | null) => {
    _setCurrentUser(user);
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        sidebarOpen,
        setSidebarOpen,
        darkMode,
        setDarkMode,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
