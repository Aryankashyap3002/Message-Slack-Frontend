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
            <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                {projectId && showFileTree && (
                    <div
                        style={{
                            backgroundColor: '#333254',
                            paddingRight: '10px',
                            paddingTop: '0.3vh',
                            minWidth: '250px',
                            maxWidth: '25%',
                            height: '100vh',
                            overflow: 'auto'
                        }}
                    >
                        <TreeStructure />
                    </div>
                )}
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        overflow: 'hidden'
                    }}
                >
                    <Allotment defaultSizes={[65, 35]}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#282a36',
                                overflow: 'hidden'
                            }}
                        >
                            <Allotment vertical={true} defaultSizes={[70, 30]}>
                                <EditorComponent />
                                <BrowserTerminal />
                            </Allotment>
                        </div>
                        <div style={{ height: '100%', overflow: 'hidden' }}>
                            {!loadBrowser ? (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    height: '100%',
                                    backgroundColor: '#f0f0f0'
                                }}>
                                    <Button 
                                        type="primary"
                                        onClick={() => setLoadBrowser(true)}
                                        size="large"
                                    >
                                        Load my browser
                                    </Button>
                                   
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