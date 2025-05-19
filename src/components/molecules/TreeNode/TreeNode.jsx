import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import { FileIcon } from '../../atoms/FileIcon/Fileicon';

export const TreeNode = ({
    fileFolderData
}) => {
    const [visibility, setVisibility] = useState({});
    const { editorSocket } = useEditorSocketStore();
    const {
        setFile,
        setIsOpen: setFileContextMenuIsOpen,
        setX: setFileContextMenuX,
        setY: setFileContextMenuY
    } = useFileContextMenuStore();

    function toggleVisibility(name) {
        setVisibility({
            ...visibility,
            [name]: !visibility[name]
        })
    }

    function computeExtension(fileFolderData) {
        const names = fileFolderData.name.split('.');
        return names[names.length - 1];
    }

    function handleDoubleClick(fileFolderData) {
        console.log('Double clicked on', fileFolderData);
        editorSocket.emit('readFile', {
            pathToFileOrFolder: fileFolderData.path
        })
    }

    function handleContextMenuForFiles(e, path) {
        e.preventDefault();
        console.log('Right clicked on', path, e);
        setFile(path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    useEffect(() => {
        console.log('Visibility changed', visibility); 
    }, [visibility])

    return (
        (fileFolderData && 
        <div className="pl-3 text-gray-300">
            {fileFolderData.children ? (
                <div className="folder-node">
                    <button
                        onClick={() => toggleVisibility(fileFolderData.name)}
                        className="flex items-center gap-2 px-2 py-1.5 w-full text-left rounded hover:bg-[#3a3a4d] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <span className="text-gray-400 flex-shrink-0 transition-transform duration-200" style={{ transform: visibility[fileFolderData.name] ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                            <IoIosArrowDown size={14} />
                        </span>
                        <span className="font-medium truncate">{fileFolderData.name}</span>
                    </button>
                    
                    {visibility[fileFolderData.name] && fileFolderData.children && (
                        <div className="ml-2 border-l border-gray-700 pl-2 mt-1">
                            {fileFolderData.children.map((child) => (
                                <TreeNode 
                                    fileFolderData={child}
                                    key={child.name}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div 
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#3a3a4d] transition-all duration-200 cursor-pointer group"
                    onContextMenu={(e) => handleContextMenuForFiles(e, fileFolderData.path)}
                    onDoubleClick={() => handleDoubleClick(fileFolderData)}
                >
                    <FileIcon extension={computeExtension(fileFolderData)} className="flex-shrink-0" />
                    <span className="text-sm truncate group-hover:text-gray-100">{fileFolderData.name}</span>
                </div>
            )}
        </div>)
    )
}