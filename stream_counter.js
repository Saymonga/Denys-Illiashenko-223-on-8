const http = require('http');

const server = http.createServer((req, res) => {

    if (req.method === 'POST' && req.url === '/count') {

        let bytes = 0;
        let chunks = 0;

        req.on('data', (chunk) => {

            chunks++;
            bytes += chunk.length;
        });

        req.on('end', () => {

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                bytes,
                chunks
            }));
        });

    } else {

        res.statusCode = 404;
        res.end('Not found');
    }
});

server.listen(process.argv[2]);