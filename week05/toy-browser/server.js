const http = require('http');

http.createServer((request, response) => {
  const {
    headers,
    method,
    url
  } = request;
  let body = [];
  request
    .on('error', (err) => {
      console.error(err);
    })
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      response.on('error', (err) => {
        console.error(err);
      });

      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      const name = body.split('=')[1]
      response.write(
`<html><head><style>body div {color: blue;}body .hello-world {color: red;}</style></head><body><div class="hello-world">hello world</div></body></html>`);
      response.end();
    });
}).listen(8080);

console.log('server started');