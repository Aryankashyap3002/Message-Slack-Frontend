// import { useQuery } from '@tanstack/react-query';

// import { getProjectStatus } from '../../../apis/projects';

// export const useGetProjectStatus = (projectId, workspaceId, options = {}) => {
//   return useQuery({
//     queryKey: ['project', 'status', workspaceId, projectId],
//     queryFn: () => getProjectStatus({ workspaceId, projectId }),
//     enabled: !!projectId && !!workspaceId,
//     refetchInterval: (data) => {
//       // Poll every 2 seconds until project is 'ready' or 'error'
//       return (data?.status === 'ready' || data?.status === 'error') ? false : 2000;
//     },
//     staleTime: 0, // Always refetch when requested
//     ...options
//   });
// };