import { useEffect, useRef } from 'react';
import { FaCopy, FaCut, FaDownload, FaEdit, FaPaste, FaTrash } from 'react-icons/fa';

import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';

export const FileContextMenu = ({ x, y, path }) => {
    const { setIsOpen } = useFileContextMenuStore();
    const { editorSocket } = useEditorSocketStore();
    const menuRef = useRef(null);

    const menuItems = [
        { label: 'Open', icon: <FaEdit size={12} className="mr-2" />, action: () => handleOpenFile() },
        { label: 'Copy', icon: <FaCopy size={12} className="mr-2" />, action: () => handleCopyFile() },
        { label: 'Cut', icon: <FaCut size={12} className="mr-2" />, action: () => handleCutFile() },
        { label: 'Paste', icon: <FaPaste size={12} className="mr-2" />, action: () => handlePasteFile() },
        { label: 'Download', icon: <FaDownload size={12} className="mr-2" />, action: () => handleDownloadFile() },
        { label: 'Delete', icon: <FaTrash size={12} className="mr-2" />, action: () => handleDeleteFile(), danger: true }
    ];

    const handleOpenFile = () => {
        console.log('Opening file:', path);
        editorSocket.emit('readFile', {
            pathToFileOrFolder: path
        });
        setIsOpen(false);
    };

    const handleCopyFile = () => {
        console.log('Copying file path to clipboard:', path);
        navigator.clipboard.writeText(path).catch(err => console.error('Failed to copy path:', err));
        setIsOpen(false);
    };

    const handleCutFile = () => {
        console.log('Cut file:', path);
        // Implement cut functionality
        setIsOpen(false);
    };

    const handlePasteFile = () => {
        console.log('Paste into:', path);
        // Implement paste functionality
        setIsOpen(false);
    };

    const handleDownloadFile = () => {
        console.log('Downloading file:', path);
        // Implement download functionality
        setIsOpen(false);
    };

    const handleDeleteFile = () => {
        console.log('Deleting file:', path);
        if (confirm(`Are you sure you want to delete ${path}?`)) {
            editorSocket.emit('deleteFile', {
                pathToFileOrFolder: path
            });
        }
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsOpen]);

    // Adjust position if menu would go off screen
    let adjustedX = x;
    let adjustedY = y;
    
    useEffect(() => {
        if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            if (x + menuRect.width > window.innerWidth) {
                adjustedX = window.innerWidth - menuRect.width - 5;
            }
            if (y + menuRect.height > window.innerHeight) {
                adjustedY = window.innerHeight - menuRect.height - 5;
            }
        }
    }, [x, y]);

    return (
        <div 
            ref={menuRef}
            className="fixed bg-[#2d2d40] border border-gray-700 rounded-md shadow-xl z-50 min-w-48 py-1 backdrop-blur-sm bg-opacity-95 transform-gpu"
            style={{ left: adjustedX, top: adjustedY }}
        >
            <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700 truncate max-w-xs font-mono">
                {path}
            </div>
            {menuItems.map((item, index) => (
                <div 
                    key={index}
                    className={`px-3 py-2 flex items-center text-sm cursor-pointer transition-colors duration-150 ${
                        item.danger 
                            ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-30' 
                            : 'text-gray-200 hover:bg-blue-800 hover:bg-opacity-30'
                    }`}
                    onClick={item.action}
                >
                    <span className="w-6 h-6 flex items-center justify-center">
                        {item.icon}
                    </span>
                    {item.label}
                </div>
            ))}
        </div>
    );
};