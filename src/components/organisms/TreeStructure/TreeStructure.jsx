import { useEffect } from 'react';

import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import { useTreeStructureStore } from '../../../store/treeStructureStore'
import { FileContextMenu } from '../../molecules/ContextMenu/FileContextMenu';
import { TreeNode } from '../../molecules/TreeNode/TreeNode';

export const TreeStructure = () => {
    const { treeStructure, setTreeStructure } = useTreeStructureStore();
    const { 
        file,
        isOpen: isFileContextOpen, 
        x: fileContextX, 
        y: fileContextY 
    } = useFileContextMenuStore();

    useEffect(() => {
        if(treeStructure) {
            console.log('tree:', treeStructure);
        } else {
            setTreeStructure();
        }
    }, [setTreeStructure, treeStructure]);

    return (
        <div className="file-explorer h-full flex flex-col overflow-auto">
            <div className="file-explorer-header px-4 py-3 text-sm font-medium border-b border-gray-700 text-gray-300">
                Explorer
            </div>
            <div className="file-explorer-content flex-grow overflow-auto pb-4">
                {isFileContextOpen && fileContextX && fileContextY && (
                    <FileContextMenu  
                        x={fileContextX}
                        y={fileContextY}
                        path={file}
                    />
                )}
                {treeStructure && (
                    <TreeNode
                        fileFolderData={treeStructure}
                    />
                )}
            </div>
        </div>
    )
}