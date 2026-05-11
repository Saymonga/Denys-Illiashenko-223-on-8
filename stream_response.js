const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname === '/file') {

        const fileName = parsedUrl.query.fileName;

        if (!fileName) {
            res.statusCode = 400;
            return res.end('fileName is required');
        }

        const readStream = fs.createReadStream(fileName);

        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8'
        });

        readStream.on('error', () => {
            res.statusCode = 400;
            res.end('File not found');
        });


        readStream.pipe(res);

    } else {

        res.statusCode = 400;
        res.end('Bad request');
    }
});

server.listen(process.argv[2]);