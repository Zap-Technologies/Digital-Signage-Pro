'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from './mockData';
import { User } from './types';

interface AdminContextType {
  currentUser: User;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  // In a real app, this would come from authentication
  const currentUser = mockUsers[0]; // Super admin user

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        sidebarOpen,
        setSidebarOpen,
        darkMode,
        setDarkMode,
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
