'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from './mockData';
import { User } from './types';

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
  // null = not logged in; set via LoginForm on successful auth
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function logout() {
    setCurrentUser(null);
  }

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
