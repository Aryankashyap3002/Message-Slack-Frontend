import { useEffect } from 'react';

import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import { useTreeStructureStore } from '../../../store/treeStructureStore'
import { FileContextMenu } from '../../molecules/ContextMenu/FileContextMenu';
import { TreeNode } from '../../molecules/TreeNode/TreeNode';

export const TreeStructure = () => {

    const {treeStructure, setTreeStructure } = useTreeStructureStore();
    const { 
        file,
        isOpen: isFileContextOpen, 
        x: fileContextX, 
        y: fileContextY } = useFileContextMenuStore();

    useEffect(() => {
        if(treeStructure) {
            console.log('tree:', treeStructure);
        } else {
            setTreeStructure();
        }
    }, [setTreeStructure, treeStructure]);

    return (
        <>
        {isFileContextOpen && fileContextX && fileContextY && (
            <FileContextMenu  
                x={fileContextX}
                y={fileContextY}
                path={file}
            />
        )}
            <TreeNode
                fileFolderData={treeStructure}
            />
        </>
    )
}