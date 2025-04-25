import { create } from 'zustand';

export const useActiveFileTabStore = create((set) => {
    return {
        activeFileTab: null,
        setActiveFileTab: (path, value, extension) => {
            console.log('Setting active file tab:', { path, extension, valueLength: value?.length });
            set({
                activeFileTab: {
                    path: path,
                    value: value,
                    extension: extension
                }
            });
        }
    }
});