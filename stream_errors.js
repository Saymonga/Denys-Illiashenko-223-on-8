const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' &&
        parsedUrl.pathname === '/missing-file') {

        const fileName = parsedUrl.query.fileName;

        if (!fileName) {
            res.statusCode = 400;
            return res.end('fileName is required');
        }

        const readStream = fs.createReadStream(fileName);

        readStream.on('error', () => {

            res.statusCode = 500;
            res.end('Internal server error');
        });

        readStream.on('open', () => {

            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8'
            });

            readStream.pipe(res);
        });

    } else {

        res.statusCode = 404;
        res.end('Not found');
    }
});

server.listen(process.argv[2]);