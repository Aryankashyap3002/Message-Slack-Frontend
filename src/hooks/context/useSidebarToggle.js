import { useContext } from 'react';

import { SidebarToggleContext } from '@/context/SidebarToggleContext';

export const useSidebarToggle = () => {
    const context = useContext(SidebarToggleContext);
    if (!context) {
      throw new Error('useSidebarToggle must be used within a SidebarToggleProvider');
    }
    return context;
  };