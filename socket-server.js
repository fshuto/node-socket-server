import net from 'net';
import config from 'config';

let server = net.createServer();
server.maxConnections = config.server.maxConnectionNumber;

// 待ち受け
server.listen(config.server.port, config.server.address, () => {
  console.log('server bound.');
});

// サーバに接続があった際のイベント処理を登録
server.on('connection', (socket) => {
  let info = socket.remoteAddress + ':' + socket.remotePort;
  server.getConnections((err, count) => {
    console.log(count);
    let status = count + '/' + server.maxConnections;
    console.log(info + ' - client connected(' + status + ')');
  });
  socket.write('hello\r\n');

  // 接続終了パケットを受信した際のイベント処理を登録
  socket.on('end', () => {
    console.log(info + ' - client disconnected');
  });

  // データを受信した際のイベント処理を登録
  socket.on('data', (data) => {
    console.log(info + ' - receive data from client - ' + data.toString());
  });

  // ソケットが閉じた際のイベント処理を登録
  socket.on('close', () => {
    console.log(info + ' - socket closed');
  });
});
