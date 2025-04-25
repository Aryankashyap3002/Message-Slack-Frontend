// // src/pages/CreateProject.jsx
// import { Button,  Form, Input, Select, Spin } from 'antd';
// import { useEffect,useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { useCreateProject } from '@/hooks/apis/mutations/useCreateProject';
// import { useGetWorkspaces } from '@/hooks/apis/queries/useGetWorkspaces';
// import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';

// export const CreateProject = () => {
//     const [form] = Form.useForm();
//     const { createProjectMutation, isPending } = useCreateProject();
//     const { workspaces, isFetching } = useGetWorkspaces();
//     const { currentWorkspace } = useCurrentWorkspace();
//     const navigate = useNavigate();
//     const [selectedWorkspace, setSelectedWorkspace] = useState(null);

//     useEffect(() => {
//         // Set default workspace if available through context
//         if (currentWorkspace && !selectedWorkspace) {
//             setSelectedWorkspace(currentWorkspace.id);
//             form.setFieldsValue({ workspaceId: currentWorkspace.id });
//         }
//     }, [currentWorkspace, form, selectedWorkspace]);

//     async function handleCreateProject(values) {
//         console.log('Creating project with values:', values);
//         try {
//             const projectData = {
//                 ...values,
//                 workspaceId: selectedWorkspace
//             };
            
//             const response = await createProjectMutation(projectData);
//             console.log('Project created:', response);
            
//             // Navigate to the project view page
//             if (selectedWorkspace) {
//                 navigate(`/project/${response.id}`);
//             } else {
//                 navigate(`/project/${response.id}`);
//             }
//         } catch(error) {
//             console.log('Error creating project', error);
//         }
//     }

//     return (
//         <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
//             <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            
//             <Form
//                 form={form}
//                 layout="vertical"
//                 onFinish={handleCreateProject}
//             >
//                 <Form.Item
//                     name="workspaceId"
//                     label="Select Workspace"
//                     rules={[{ required: true, message: 'Please select a workspace' }]}
//                 >
//                     {isFetching ? (
//                         <Spin size="small" />
//                     ) : (
//                         <Select 
//                             placeholder="Select a workspace"
//                             onChange={(value) => setSelectedWorkspace(value)}
//                         >
//                             {workspaces?.map(workspace => (
//                                 <Select.Option key={workspace.id} value={workspace.id}>
//                                     {workspace.name}
//                                 </Select.Option>
//                             ))}
//                         </Select>
//                     )}
//                 </Form.Item>
                
//                 <Form.Item
//                     name="name"
//                     label="Project Name"
//                     rules={[{ required: true, message: 'Please enter a project name' }]}
//                 >
//                     <Input placeholder="Enter project name" />
//                 </Form.Item>
                
//                 <Form.Item
//                     name="description"
//                     label="Description"
//                 >
//                     <Input.TextArea placeholder="Enter project description (optional)" />
//                 </Form.Item>
                
//                 <Form.Item>
//                     <Button 
//                         type="primary" 
//                         htmlType="submit"
//                         loading={isPending}
//                         className="w-full"
//                     >
//                         Create Project
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// }

// export default CreateProject;