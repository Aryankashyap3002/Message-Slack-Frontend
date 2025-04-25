import 'xterm/css/xterm.css'; 

import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit'; 

import { useTerminalSocketStore } from '../../../store/terminalSocketStore';

export const BrowserTerminal = () => {

    const terminalRef = useRef(null);
    // const socket = useRef(null);
    // const {projectId: projectIdFromUrl } = useParams();

    const { terminalSocket } = useTerminalSocketStore();
    

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#282a37',
                foreground: '#f8f8f3',
                cursor: '#f8f8f3',
                cursorAccent: '#282a37',
                red: '#ff5544',
                green: '#50fa7c',
                yellow: '#f1fa8c',
                cyan: '#8be9fd',
            },
            fontSize: 16,
            fontFamily: 'Fira Code',
            convertEol: true, // convert CRLF to LF
        });

        term.open(terminalRef.current);
        let fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();

        if(terminalSocket) {
            terminalSocket.onopen = () => {
                const attachAddon = new AttachAddon(terminalSocket);
                term.loadAddon(attachAddon);
                // socket.current = ws;
            }
        }


        return () => {
            term.dispose();
            terminalSocket?.close();
        }
    }, [terminalSocket])

    return (
        <div
            ref={terminalRef}
            style={{
                width: '100vw',
            }}
            className='terminal'
            id="terminal-container"
        >

        </div>
    )
}