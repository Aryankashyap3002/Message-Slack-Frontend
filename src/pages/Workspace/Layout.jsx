import { WorkspaceNavbar } from '@/components/organisms/Workspace/WorkspaceNavbar';
import { WorkspacePanel } from '@/components/organisms/Workspace/WorkspacePanel';
import { WorkspaceSidebar } from '@/components/organisms/Workspace/WorkspaceSidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useSidebarToggle } from '@/hooks/context/useSidebarToggle'; 

export const WorkspaceLayout = ({ children }) => {
    const { showWorkspacePanel } = useSidebarToggle();

    return (
        <div className="h-[100vh]">
            <WorkspaceNavbar />
            <div className="flex h-[calc(100vh-40px)]">
                <WorkspaceSidebar />
                {showWorkspacePanel ? (
                    <ResizablePanelGroup direction="horizontal" autoSaveId={'workspace-resize'}>
                        <ResizablePanel
                            defaultSize={20}
                            minSize={11}
                            className="bg-[#5E2C5F]"
                        >
                            <WorkspacePanel />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            minSize={20}
                        >
                            {children}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                ) : (
                    <div className="w-full">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};