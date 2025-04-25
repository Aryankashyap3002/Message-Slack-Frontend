import { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

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
        <div className="pl-4 text-gray-300">
            {fileFolderData.children ? (
                <div>
                    <button
                        onClick={() => toggleVisibility(fileFolderData.name)}
                        className="flex items-center gap-2 p-2 w-full text-left rounded hover:bg-[#2a2a3d] transition-colors"
                    >
                        <span className="text-gray-400">
                            {visibility[fileFolderData.name] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                        </span>
                        <span className="font-medium">{fileFolderData.name}</span>
                    </button>
                    
                    {visibility[fileFolderData.name] && fileFolderData.children && (
                        <div className="ml-2 border-l border-gray-700 pl-2">
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
                    className="flex items-center gap-2 p-2 rounded hover:bg-[#2a2a3d] transition-colors cursor-pointer"
                    onContextMenu={(e) => handleContextMenuForFiles(e, fileFolderData.path)}
                    onDoubleClick={() => handleDoubleClick(fileFolderData)}
                >
                    <FileIcon extension={computeExtension(fileFolderData)} />
                    <span className="text-sm">{fileFolderData.name}</span>
                </div>
            )}
        </div>)
    )
}