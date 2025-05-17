import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { extensionToFileType } from '../../../utils/extensionToFileType';

export const SimpleEditorComponent = () => {
    // Simple debounce implementation for changes
    let timerId = null;
    const editorRef = useRef(null);
    
    const { activeFileTab } = useActiveFileTabStore();
    const { editorSocket } = useEditorSocketStore();

    // Handle editor mount
    function handleEditorMount(editor) {
        editorRef.current = editor;
        
        // Set initial value if available
        if (activeFileTab?.value) {
            editor.setValue(activeFileTab.value);
        }
    }

    // Handle content changes with simple debounce
    function handleChange(value) {
        if (timerId != null) {
            clearTimeout(timerId);
        }
        
        timerId = setTimeout(() => {
            if (activeFileTab?.path) {
                editorSocket.emit('writeFile', {
                    data: value,
                    pathToFileOrFolder: activeFileTab.path
                });
            }
        }, 1000);
    }

    // Update editor content when activeFileTab changes
    useEffect(() => {
        if (editorRef.current && activeFileTab?.value) {
            editorRef.current.setValue(activeFileTab.value);
        }
    }, [activeFileTab]);

    return (
        <div className="editor-container">
            <Editor
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                defaultValue="// Welcome to the code editor"
                value={activeFileTab?.value || '// Welcome to the code editor'}
                language={extensionToFileType(activeFileTab?.extension)}
                theme="vs-dark"
                options={{
                    fontSize: 16,
                    fontFamily: '\'JetBrains Mono\', \'Fira Code\', monospace',
                    fontLigatures: true,
                    scrollBeyondLastLine: false,
                    minimap: { enabled: false },
                    renderLineHighlight: 'all',
                    lineNumbers: 'on',
                    lineHeight: 1.5,
                    padding: { top: 15 },
                    folding: true,
                    autoIndent: 'full',
                    formatOnPaste: true,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on'
                }}
                onChange={handleChange}
                onMount={handleEditorMount}
                className="monaco-editor-simple"
            />
        </div>
    );
};

export default SimpleEditorComponent;