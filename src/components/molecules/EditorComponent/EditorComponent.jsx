import Editor from '@monaco-editor/react';
import { useEffect, useRef,useState } from 'react';

import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { extensionToFileType } from '../../../utils/extensionToFileType';

export const EditorComponent = () => {
    let timerId = null;
    const [editorState, setEditorState] = useState({
        theme: null
    });
    const editorRef = useRef(null);
    const containerRef = useRef(null);

    const { activeFileTab } = useActiveFileTabStore();
    const { editorSocket } = useEditorSocketStore();

    async function downloadTheme() {
        try {
            const response = await fetch('/Dracula.json');
            const data = await response.json();
            console.log('Editor theme loaded successfully');
            setEditorState({ ...editorState, theme: data });
        } catch (error) {
            console.error('Failed to load editor theme:', error);
            // Proceed without theme if we can't load it
            setEditorState({ ...editorState, theme: 'vs-dark' });
        }
    }

    function handleEditorMount(editor, monaco) {
        console.log('Editor mounted successfully');
        editorRef.current = editor;
        
        try {
            if (editorState.theme) {
                if (typeof editorState.theme === 'object') {
                    monaco.editor.defineTheme('dracula', editorState.theme);
                    monaco.editor.setTheme('dracula');
                } else {
                    monaco.editor.setTheme(editorState.theme);
                }
            }
            
            // Force editor to have a height
            editor.layout();
            
            // Force content update
            if (activeFileTab?.value) {
                console.log('Setting editor value from activeFileTab');
                editor.setValue(activeFileTab.value);
            } else {
                console.log('No active file tab value to set');
                editor.setValue('// Welcome to the playground');
            }
        } catch (error) {
            console.error('Error in editor mount:', error);
        }
    }

    function handleChange(value) {
        if (timerId != null) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            if (activeFileTab?.path) {
                console.log('Sending writefile event');
                editorSocket.emit('writeFile', {
                    data: value,
                    pathToFileOrFolder: activeFileTab.path
                });
            }
        }, 2000);
    }

    // Update editor content when activeFileTab changes
    useEffect(() => {
        if (editorRef.current && activeFileTab?.value) {
            console.log('Updating editor with new file content');
            editorRef.current.setValue(activeFileTab.value);
        }
    }, [activeFileTab]);

    useEffect(() => {
        downloadTheme();
        
        // Force redraw if container dimensions change
        const resizeObserver = new ResizeObserver(() => {
            if (editorRef.current) {
                console.log('Container resized, updating editor layout');
                editorRef.current.layout();
            }
        });
        
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #333'  // Visual boundary for debugging
            }}
        >
            {(editorState.theme || true) && (
                <Editor
                    width="100%"
                    height="100%" 
                    defaultLanguage="javascript"
                    defaultValue="// Welcome to the playground"
                    options={{
                        fontSize: 18,
                        fontFamily: 'monospace',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        minimap: { enabled: false }
                    }}
                    language={extensionToFileType(activeFileTab?.extension)}
                    onChange={handleChange}
                    onMount={handleEditorMount}
                    value={activeFileTab?.value || '// Welcome to the playground'}
                />
            )}
        </div>
    );
};

export default EditorComponent;