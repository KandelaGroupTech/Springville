import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './lib/firebase.js';
import { doc, getDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Handle /api/get-guest
    if (req.url === '/api/get-guest') {
        try {
            const docRef = doc(db, "guests", "default");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(docSnap.data()));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Guest not found" }));
            }
        } catch (error) {
            console.error("Error fetching guest data:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
        return;
    }

    // Serve static files
    let filePath = '.' + req.url;

    // Remove query string if present
    filePath = filePath.split('?')[0];

    // Handle directory requests
    if (filePath.endsWith('/')) {
        filePath += 'index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Mock server running at http://localhost:${PORT}/`);
    console.log(`API endpoint: http://localhost:${PORT}/api/get-guest`);
    console.log(`Welcome page: http://localhost:${PORT}/welcome/index.html`);
});
