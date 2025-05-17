import { create } from 'zustand';

import { useActiveFileTabStore } from './activeFileTabStore';
import { usePortStore } from './portStore';
import { useTreeStructureStore } from './treeStructureStore';

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {

        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const projectTreeStructureSetter = useTreeStructureStore.getState().setTreeStructure;
        const portSetter = usePortStore.getState().setPort;

        incomingSocket?.on('readFileSuccess', (data) => {
            console.log('Read file success', data);
            const fileExtension = data.path.split('.').pop();
            console.log('editorSocket file data ', data.value)
            activeFileTabSetter(data.path, data.value, fileExtension);
        });

        incomingSocket?.on('writeFileSuccess', (data) => {
            console.log('Write file success', data);
            // incomingSocket.emit("readFile", {
            //     pathToFileOrFolder: data.path
            // })
        });

        incomingSocket?.on('deleteFileSuccess', () => {
            projectTreeStructureSetter();
        });

        incomingSocket?.on('getPortSuccess', ({ port }) => {
            console.log('Port received in editorSocketStore:', port);
            if (port) {
                portSetter(port);
            } else {
                console.error('Received empty port value from server');
            }
        });

        set({
            editorSocket: incomingSocket
        });
    }
}));