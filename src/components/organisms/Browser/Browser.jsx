import { useEffect, useRef,useState } from 'react';

import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { usePortStore } from '../../../store/portStore';

export const Browser = ({ projectId }) => {
    const { port } = usePortStore();
    const { editorSocket } = useEditorSocketStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const iframeRef = useRef(null);

    useEffect(() => {
        // If we don't have a port yet, request it from the server
        if (!port && editorSocket) {
            console.log('Requesting port from server...');
            editorSocket.emit('getPort', { projectId });
        }
        
        // When we do have a port, mark as loaded
        if (port) {
            console.log('Port received:', port);
            setIsLoading(false);
        }
    }, [port, editorSocket, projectId]);

    // Handle iframe load errors
    const handleIframeError = () => {
        setError('Failed to load the preview. Server might not be running.');
    };

    // Handle iframe successful load
    const handleIframeLoad = () => {
        console.log('Browser iframe loaded successfully');
        setIsLoading(false);
    };

    return (
        <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden'
        }}>
            <div style={{ 
                padding: '8px 12px', 
                borderBottom: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#e4e4e4'
            }}>
                <div style={{ 
                    flex: 1,
                    backgroundColor: '#fff', 
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '14px',
                    border: '1px solid #ccc'
                }}>
                    {port ? `http://localhost:${port}` : 'Loading URL...'}
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5'
                    }}>
                        Loading preview...
                    </div>
                )}

                {error && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        color: 'red',
                        flexDirection: 'column',
                        padding: '20px'
                    }}>
                        <p>{error}</p>
                        <button 
                            onClick={() => {
                                setError(null);
                                if (iframeRef.current) {
                                    iframeRef.current.src = `http://localhost:${port}`;
                                }
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {port && (
                    <iframe
                        ref={iframeRef}
                        src={`http://localhost:${port}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            display: port ? 'block' : 'none'
                        }}
                        onError={handleIframeError}
                        onLoad={handleIframeLoad}
                    />
                )}
            </div>
        </div>
    );
};