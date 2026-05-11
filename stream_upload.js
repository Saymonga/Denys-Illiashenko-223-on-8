const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    if (req.method === 'POST' && req.url === '/upload') {

        const writeStream = fs.createWriteStream('upload.txt');

        req.pipe(writeStream);

        req.on('end', () => {
            res.statusCode = 200;
            res.end('File uploaded');
        });

        writeStream.on('error', () => {
            res.statusCode = 500;
            res.end('Write error');
        });

    } else {

        res.statusCode = 404;
        res.end('Not found');
    }
});

server.listen(process.argv[2]);