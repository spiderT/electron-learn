const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('open', () => {
  console.log('connected');
});

server.on('close', () => {
  console.log('disconnected');
});

server.on('connection', (ws, req, client) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);

    // 广播消息给所有客户端
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
