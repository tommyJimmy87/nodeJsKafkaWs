var kafka = require('kafka-node')
var Consumer = kafka.Consumer
var client = new kafka.Client("localhost:2181/")

var WebSocketServer = require('ws').Server
, wss = new WebSocketServer({ port: 8009 });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
};


var consumer = new Consumer(
    client,
    [
      { topic: 'test-topic', partition: 0, offset: 0}
    ],
    {
      fromOffset: true
    }
  );


consumer.on('message', function (message) {
  console.log("received message", message);
  wss.broadcast(message["value"]);
});
