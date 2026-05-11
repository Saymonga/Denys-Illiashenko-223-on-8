const http = require('http');
const fs = require('fs');
const url = require('url');
const { Transform } = require('stream');

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname === '/upper') {

        const fileName = parsedUrl.query.fileName;

        if (!fileName) {
            res.statusCode = 400;
            return res.end('fileName is required');
        }

        const readStream = fs.createReadStream(fileName);

        const upperCaseTransform = new Transform({

            transform(chunk, encoding, callback) {

                const upperChunk = chunk
                    .toString()
                    .toUpperCase();

                callback(null, upperChunk);
            }
        });

        readStream.on('error', () => {
            res.statusCode = 400;
            res.end('File not found');
        });

        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8'
        });

        readStream
            .pipe(upperCaseTransform)
            .pipe(res);

    } else {

        res.statusCode = 404;
        res.end('Not found');
    }
});

server.listen(process.argv[2]);