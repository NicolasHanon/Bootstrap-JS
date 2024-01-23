const http = require('http');
const fs = require('fs');
const url = require('url');

class GreetingServer {
  constructor() {
    this.server = http.createServer(this.requestHandler.bind(this));
  }

  start(port) {
    this.server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  }

  requestHandler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const name = parsedUrl.query.name || 'whoever you are';
    console.log(name);

    if (parsedUrl.pathname === '/') {
      fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading index.html file:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          const greetingMessage = name;
          const modifiedHtml = data.replace('$NAME', greetingMessage);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(modifiedHtml);
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
  
}

const greetingServer = new GreetingServer();

greetingServer.server.on('connection', (socket) => {
    console.log('Client connected');
  
    // Handle disconnection
    socket.on('close', () => {
      console.log('Client disconnected');
    });
});

const port = 3000; // Replace with the desired port number
greetingServer.start(port);
