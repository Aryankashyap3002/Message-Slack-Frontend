
import { createContext, useState } from 'react';

export const SidebarToggleContext = createContext(null);

export const SidebarToggleProvider = ({ children }) => {
  const [showWorkspacePanel, setShowWorkspacePanel] = useState(true);
  const [showFileTree, setShowFileTree] = useState(true);

  const toggleWorkspacePanel = () => setShowWorkspacePanel(prev => !prev);
  const toggleFileTree = () => setShowFileTree(prev => !prev);

  return (
    <SidebarToggleContext.Provider 
      value={{ 
        showWorkspacePanel, 
        toggleWorkspacePanel, 
        showFileTree, 
        toggleFileTree 
      }}
    >
      {children}
    </SidebarToggleContext.Provider>
  );
};