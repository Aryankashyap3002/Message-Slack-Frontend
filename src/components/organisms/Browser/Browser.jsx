import { ReloadOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { usePortStore } from '../../../store/portStore';

export const Browser = ({ projectId }) => {
    const { port } = usePortStore();
    const { editorSocket } = useEditorSocketStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const iframeRef = useRef(null);
    const retryCount = useRef(0);
    const maxRetries = 5;

    useEffect(() => {
        // Request the port if we don't have it yet
        if (!port && editorSocket && editorSocket.connected) {
            console.log('Requesting port from server...');
            // This is key - using the correct parameter name as shown in your sample code
            editorSocket.emit('getPort', { containerName: projectId });
            
            // Set a retry mechanism for getting the port
            const retryTimer = setTimeout(() => {
                if (!port && retryCount.current < maxRetries) {
                    console.log(`Retrying port request (${retryCount.current + 1}/${maxRetries})...`);
                    editorSocket.emit('getPort', { containerName: projectId });
                    retryCount.current += 1;
                } else if (!port && retryCount.current >= maxRetries) {
                    setError('Could not get port information after multiple attempts. Please refresh the page.');
                }
            }, 2000);
            
            return () => clearTimeout(retryTimer);
        }
        
        // When we have the port, mark loading as complete
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
        if (iframeRef.current) {
            // Due to cross-origin restrictions, we can't directly access the iframe content
            // We'll assume it loaded successfully when the onLoad event fires
            console.log('Browser iframe load event fired');
            setIsLoading(false);
            setError(null);
            
            // We don't try to access contentDocument or contentWindow.document anymore
            // as this will always fail with cross-origin restrictions
        }
    };

    // Function to refresh the iframe
    const handleRefresh = () => {
        setError(null);
        setIsLoading(true);
        if (iframeRef.current && port) {
            // Force reload by setting the same URL again
            const oldAddr = iframeRef.current.src;
            iframeRef.current.src = oldAddr;
        }
    };

    if (!port) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%',
                backgroundColor: '#22212b',
                color: 'white',
                fontFamily: 'Fira Code'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: '#22212b',
            overflow: 'hidden'
        }}>
            <div style={{ 
                padding: '8px 12px', 
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#22212b'
            }}>
                <ReloadOutlined 
                    onClick={handleRefresh} 
                    style={{ 
                        color: 'white', 
                        marginRight: '8px',
                        cursor: 'pointer' 
                    }}
                />
                <div style={{ 
                    flex: 1,
                    backgroundColor: '#282a35', 
                    color: 'white',
                    fontFamily: 'Fira Code',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '14px',
                }}>
                    {`http://localhost:${port}`}
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
                        backgroundColor: '#22212b',
                        color: 'white',
                        fontFamily: 'Fira Code'
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
                        backgroundColor: '#22212b',
                        color: 'red',
                        fontFamily: 'Fira Code',
                        flexDirection: 'column',
                        padding: '20px'
                    }}>
                        <p>{error}</p>
                        <button 
                            onClick={handleRefresh}
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

                <iframe
                    ref={iframeRef}
                    src={`http://localhost:${port}`}
                    style={{
                        width: '100%',
                        height: '95vh',
                        border: 'none',
                        display: port ? 'block' : 'none'
                    }}
                    onError={handleIframeError}
                    onLoad={handleIframeLoad}
                    allow="fullscreen"
                    referrerPolicy="no-referrer"
                />
            </div>
        </div>
    );
};