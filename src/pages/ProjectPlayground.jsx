import 'allotment/dist/style.css';

import { Allotment } from 'allotment';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import { EditorComponent } from '@/components/molecules/EditorComponent/EditorComponent' 
import { useSidebarToggle } from '@/hooks/context/useSidebarToggle'; 

import { BrowserTerminal } from '../components/molecules/BrowserTerminal/BrowserTerminal';
import { Browser } from '../components/organisms/Browser/Browser';
import { TreeStructure } from '../components/organisms/TreeStructure/TreeStructure';
import { useEditorSocketStore } from '../store/editorSocketStore';
import { useTerminalSocketStore } from '../store/terminalSocketStore';
import { useTreeStructureStore } from '../store/treeStructureStore';

export const ProjectPlayground = () => {
    const { projectId: projectIdFromUrl } = useParams();
    const { setProjectId, projectId } = useTreeStructureStore();
    const { editorSocket, setEditorSocket } = useEditorSocketStore();
    const { terminalSocket, setTerminalSocket } = useTerminalSocketStore();
    const { showFileTree } = useSidebarToggle();

    const [loadBrowser, setLoadBrowser] = useState(false);

    useEffect(() => {
        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);

            // Connect to editor socket
            const editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL2}/editor`, {
                query: {
                    projectId: projectIdFromUrl
                }
            });

            // Request port information as soon as connected
            editorSocketConn.on('connect', () => {
                console.log('Editor socket connected, requesting port...');
                editorSocketConn.emit('getPort', { containerName: projectIdFromUrl });
            });

            setEditorSocket(editorSocketConn);

            // Connect to terminal socket
            try {
                const ws = new WebSocket('ws://localhost:4000/terminal?projectId=' + projectIdFromUrl);
                setTerminalSocket(ws);
                
                // Handle potential connection errors
                ws.onerror = (error) => {
                    console.error('Terminal WebSocket error:', error);
                };
            } catch (error) {
                console.error('Error creating terminal WebSocket connection:', error);
            }
        }

        // Clean up connections on unmount
        return () => {
            if (editorSocket) {
                editorSocket.disconnect();
            }
            if (terminalSocket) {
                terminalSocket.close();
            }
        };
    }, [projectIdFromUrl, setProjectId, setEditorSocket, setTerminalSocket]);

    return (
        <>
            <div className="flex h-screen overflow-hidden bg-[#1e1e2e]">
                {projectId && showFileTree && (
                    <div
                        className="flex-shrink-0 bg-[#2b2b3d] border-r border-gray-800 min-w-[250px] max-w-[25%] h-screen overflow-hidden transition-all duration-300 shadow-md"
                    >
                        <TreeStructure />
                    </div>
                )}
                <div
                    className="flex-grow h-screen overflow-hidden"
                >
                    <Allotment defaultSizes={[65, 35]}>
                        <div
                            className="flex flex-col w-full h-full bg-[#282a36] overflow-hidden"
                        >
                            <Allotment vertical={true} defaultSizes={[70, 30]}>
                                <EditorComponent />
                                <BrowserTerminal />
                            </Allotment>
                        </div>
                        <div className="h-full overflow-hidden border-l border-gray-800">
                            {!loadBrowser ? (
                                <div className="flex flex-col justify-center items-center h-full bg-[#24253a] text-gray-300">
                                    <div className="text-center p-6 rounded-lg">
                                        <h3 className="text-xl font-medium mb-6">Browser Preview</h3>
                                        <Button 
                                            type="primary"
                                            onClick={() => setLoadBrowser(true)}
                                            size="large"
                                            className="bg-blue-600 hover:bg-blue-500 border-none shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                                        >
                                            Load Browser
                                        </Button>
                                        <p className="mt-4 text-sm text-gray-500">
                                            Click to load the browser preview
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                projectIdFromUrl && (
                                    <Browser projectId={projectIdFromUrl} />
                                )
                            )}
                        </div>
                    </Allotment>
                </div>
            </div>
        </>
    );
};