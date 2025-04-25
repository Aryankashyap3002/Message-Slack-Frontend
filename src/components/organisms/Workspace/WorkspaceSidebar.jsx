import { BellIcon, FolderIcon, FolderTreeIcon, HomeIcon, MessageSquareIcon, MoreHorizontalIcon, PanelLeftIcon, PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { SidebarButton } from '@/components/molecules/SidebarButton/SidebarButton'; 
import { WorkspaceSwitcher } from '@/components/organisms/Workspace/WorkspaceSwitcher';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCreateProject } from '@/hooks/apis/mutations/useCreateProject';
import { useGetAllProjects } from '@/hooks/apis/queries/useGetAllProjects';
import { useSidebarToggle } from '@/hooks/context/useSidebarToggle';
import { useTreeStructureStore } from '@/store/treeStructureStore';

export const WorkspaceSidebar = () => {
    const [createMenuOpen, setCreateMenuOpen] = useState(false);
    const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { workspaceId } = useParams();
    const location = useLocation();
    const { createProjectMutation, isPending } = useCreateProject();
    const { toggleWorkspacePanel, toggleFileTree } = useSidebarToggle();
    const setProjectId = useTreeStructureStore(state => state.setProjectId);
    
    // Fetch all projects for this workspace
    const { data: projects, isLoading, error } = useGetAllProjects(workspaceId);

    // Check if we're on a project page to determine if we should show the file tree toggle
    const isProjectPage = location.pathname.includes('/projects/');

    async function handleCreateProject() {
        setCreateMenuOpen(false);
        console.log('Going to trigger the API with workspace ID:', workspaceId);
        try {
            const response = await createProjectMutation({ workspaceId });
            console.log('Project created successfully:', response);

            // Check the response structure to correctly access the project ID
            const projectId = response.data?._id || response.data;

            if (projectId) {
                // Navigate to the project page with both workspace and project IDs
                navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
            } else {
                console.error('Project ID not found in response', response);
            }
        } catch(error) {
            console.error('Error creating project', error);
        }
    }

    const handleProjectSelect = (projectId) => {
        setProjectsMenuOpen(false);
        setProjectId(projectId);
        navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
    };

    return (
        <aside
        className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[10px] pb-[5px]"
        >
            <WorkspaceSwitcher />

            <SidebarButton 
                Icon={HomeIcon}
                label="Home"
                onClick={() => navigate(`/workspaces/${workspaceId}`)}
            />

            {/* Projects Menu Button */}
            <Popover open={projectsMenuOpen} onOpenChange={setProjectsMenuOpen}>
                <PopoverTrigger asChild>
                    <div className="cursor-pointer">
                        <SidebarButton
                            Icon={FolderIcon}
                            label="Projects"
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 max-h-80 overflow-y-auto" side="right">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium mb-2">Projects</h3>
                        
                        {isLoading && <p className="text-sm text-muted-foreground">Loading projects...</p>}
                        
                        {error && (
                            <p className="text-sm text-red-500">
                                Error loading projects: {error.message}
                            </p>
                        )}
                        
                        {projects && projects.length === 0 && (
                            <p className="text-sm text-muted-foreground">No projects found</p>
                        )}
                        
                        {projects && projects.map((project) => (
                            <Button 
                                key={project.id} 
                                variant="ghost" 
                                className="justify-start text-left h-auto py-2"
                                onClick={() => handleProjectSelect(project.id)}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">{project.name || project.id}</span>
                                    {project.description && (
                                        <span className="text-xs text-muted-foreground truncate w-full">
                                            {project.description}
                                        </span>
                                    )}
                                </div>
                            </Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            <SidebarButton
                Icon={MessageSquareIcon}
                label="DMs"
            />

            {/* Create Project Button with Popover */}
            <Popover open={createMenuOpen} onOpenChange={setCreateMenuOpen}>
                <PopoverTrigger asChild>
                    <div className="cursor-pointer">
                        <SidebarButton
                            Icon={PlusCircleIcon}
                            label="Create"
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-48" side="right">
                    <div className="flex flex-col gap-2">
                        <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={handleCreateProject}
                            disabled={isPending}
                        >
                            {isPending ? 'Creating...' : 'Create Project'}
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Workspace Panel Toggle Button */}
            <SidebarButton
                Icon={PanelLeftIcon}
                label="Panel"
                onClick={toggleWorkspacePanel}
            />

            {/* File Tree Toggle Button - Only show on project pages */}
            {isProjectPage && (
                <SidebarButton
                    Icon={FolderTreeIcon}
                    label="Files"
                    onClick={toggleFileTree}
                />
            )}

            <SidebarButton
                Icon={BellIcon}
                label="Notifications"
            />

            <SidebarButton
                Icon={MoreHorizontalIcon}
                label="More"
            />

            <div className='flex flex-col items-center justify-center mt-auto mb-5 gap-y-1'>
                <UserButton />
            </div>
        </aside>
    );
};