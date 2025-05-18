import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';

import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { extensionToFileType } from '../../../utils/extensionToFileType';

export const EditorComponent = () => {
    let timerId = null;
    const editorRef = useRef(null);
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);
    console.log(isThemeLoaded);
    
    const { activeFileTab } = useActiveFileTabStore();
    const { editorSocket } = useEditorSocketStore();

    // Define Dracula theme inline to avoid network request
    const draculaTheme = {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: '', foreground: 'f8f8f2' },
            { token: 'invalid', foreground: 'ff5555' },
            { token: 'emphasis', fontStyle: 'italic' },
            { token: 'strong', fontStyle: 'bold' },

            { token: 'variable', foreground: 'f8f8f2' },
            { token: 'variable.predefined', foreground: 'ff79c6' },
            { token: 'constant', foreground: 'bd93f9' },
            { token: 'comment', foreground: '6272a4' },
            { token: 'number', foreground: 'bd93f9' },
            { token: 'number.hex', foreground: 'bd93f9' },
            { token: 'regexp', foreground: 'f1fa8c' },
            { token: 'annotation', foreground: 'f8f8f2' },
            { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },

            { token: 'delimiter', foreground: 'ff79c6' },
            { token: 'delimiter.html', foreground: 'f8f8f2' },
            { token: 'delimiter.xml', foreground: 'f8f8f2' },

            { token: 'tag', foreground: 'ff79c6' },
            { token: 'tag.id.pug', foreground: 'bd93f9' },
            { token: 'tag.class.pug', foreground: 'bd93f9' },
            { token: 'meta.scss', foreground: 'f8f8f2' },
            { token: 'metatag', foreground: 'ff79c6' },
            { token: 'metatag.content.html', foreground: 'f1fa8c' },
            { token: 'metatag.html', foreground: 'ff79c6' },
            { token: 'metatag.xml', foreground: 'ff79c6' },
            { token: 'metatag.php', fontStyle: 'bold' },

            { token: 'key', foreground: '50fa7b' },
            { token: 'string.key.json', foreground: '50fa7b' },
            { token: 'string.value.json', foreground: 'f1fa8c' },

            { token: 'attribute.name', foreground: '50fa7b' },
            { token: 'attribute.value', foreground: 'f1fa8c' },
            { token: 'attribute.value.number', foreground: 'bd93f9' },
            { token: 'attribute.value.unit', foreground: 'bd93f9' },
            { token: 'attribute.value.html', foreground: 'f1fa8c' },
            { token: 'attribute.value.xml', foreground: 'f1fa8c' },

            { token: 'string', foreground: 'f1fa8c' },
            { token: 'string.html', foreground: 'f1fa8c' },
            { token: 'string.sql', foreground: 'f1fa8c' },
            { token: 'string.yaml', foreground: 'f1fa8c' },

            { token: 'keyword', foreground: 'ff79c6' },
            { token: 'keyword.json', foreground: 'ff79c6' },
            { token: 'keyword.flow', foreground: 'ff79c6' },
            { token: 'keyword.flow.scss', foreground: 'ff79c6' },

            { token: 'operator.scss', foreground: 'ff79c6' },
            { token: 'operator.sql', foreground: 'ff79c6' },
            { token: 'operator.swift', foreground: 'ff79c6' },
            { token: 'predefined.sql', foreground: 'ff79c6' },
            
            { token: 'function', foreground: '50fa7b' },
            { token: 'function.macro', foreground: '50fa7b' },
            
            { token: 'parameter', foreground: 'ffb86c' }
        ],
        colors: {
            'editor.foreground': '#f8f8f2',
            'editor.background': '#282a36',
            'editor.selectionBackground': '#44475a',
            'editor.lineHighlightBackground': '#3a3c4e',
            'editorCursor.foreground': '#f8f8f2',
            'editorWhitespace.foreground': '#3B3A32',
            'editorIndentGuide.activeBackground': '#9D550FB0',
            'editor.selectionHighlightBorder': '#222218',
            'editorLineNumber.foreground': '#6D8A88'
        }
    };

    // Handle editor mount
    function handleEditorMount(editor, monaco) {
        // Save editor reference
        editorRef.current = editor;
        
        // Define and set theme
        monaco.editor.defineTheme('dracula', draculaTheme);
        monaco.editor.setTheme('dracula');
        setIsThemeLoaded(true);
        
        // Set initial value if available
        if (activeFileTab?.value) {
            editor.setValue(activeFileTab.value);
        }
    }

    // Handle editor changes
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
            editorRef.current.setValue(activeFileTab.value);
        }
    }, [activeFileTab]);

    return (
        <div className="monaco-editor-wrapper">
            <Editor 
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                defaultValue="// Welcome to the playground"
                language={extensionToFileType(activeFileTab?.extension)}
                value={activeFileTab?.value || '// Welcome to the playground'}
                onChange={handleChange}
                onMount={handleEditorMount}
                options={{
                    fontSize: 16,
                    fontFamily: '\'Fira Code\', \'JetBrains Mono\', monospace',
                    fontLigatures: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    padding: { top: 15 },
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    renderLineHighlight: 'all',
                    bracketPairColorization: {
                        enabled: true
                    },
                    formatOnPaste: true,
                    formatOnType: true,
                    tabSize: 2,
                    autoIndent: 'full',
                    copyWithSyntaxHighlighting: true
                }}
                className="monaco-editor-colorful"
            />
        </div>
    );
};

export default EditorComponent;