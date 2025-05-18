import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fixErrorProject } from '../../../apis/projects';

export const useFixProject = () => {
    const queryClient = useQueryClient();
    
    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: (data) => fixErrorProject(data),
        onSuccess: (data, variables) => {
            // Invalidate project status queries to refresh data
            queryClient.invalidateQueries(['project', 'status', variables.workspaceId, variables.projectId]);
            
            // Also invalidate the projects list
            queryClient.invalidateQueries(['projects', variables.workspaceId]);
            
            console.log('Project fixed successfully', data);
        },
        onError: (error) => {
            console.error('Error fixing project', error);
        }
    });

    return {
        fixProjectMutation: mutateAsync,
        isFixing: isPending,
        isFixSuccess: isSuccess,
        fixError: error
    };
};