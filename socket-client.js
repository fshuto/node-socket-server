import net from 'net';
import config from 'config';

let options = {};
options.host = config.server.address;
options.port = config.server.port;
let client = net.createConnection(options);
let info = options.host + ':' + options.port;

// エラー時のイベント処理を登録
client.on('error', (error) => {
  console.log(info + ' - connection failed');
  console.error(error.message);
});

// 接続した際のイベント処理を登録
client.on('connect', () => {
  console.log(info + ' - connected');
});

// タイムアウトした際のイベント処理を登録
let timeoutCount = 0;
client.setTimeout(config.client.timeoutMillisec);
client.on('timeout', () => {
  console.log('send data to server - ' + timeoutCount + ': Hello World');
  client.write(timeoutCount + ': Hello World');
  timeoutCount = timeoutCount + 1;

  // 5回データを送信したら接続を切る
  if (timeoutCount >= config.client.maxDataSendCount) {
    client.end();
    console.log(info + ' - connetion closed');
  }
});

// データを受信した際のイベント処理を登録
client.on('data', (data) => {
  console.log('receive data - ' + data.toString());
});

// 接続終了パケットを受信した際のイベント処理を登録
client.on('end', (had_error) => {
  client.setTimeout(0);
  console.log(info + ' - connetion end');
});

// 接続が途切れた際のイベント処理を登録
client.on('close', (had_error) => {
  if (had_error) {
    console.log('Client Error Closed');
  } else {
    console.log('Client Closed');
  }
});
