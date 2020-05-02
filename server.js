const node1BlockchainServer = "http://18.216.2.160:8541"
const node2BlockchainServer = "http://18.216.2.160:8542"
const node3BlockchainServer = "http://18.216.2.160:8543"

const express = require('express');
const BlockchainService = require("./services/blockchain-service")

var blockchainServiceNode1 = new BlockchainService(node1BlockchainServer)
var blockchainServiceNode2 = new BlockchainService(node2BlockchainServer)
var blockchainServiceNode3 = new BlockchainService(node3BlockchainServer)

const app = express();
const port = process.env.PORT || 5000;

var BlockchainController = require('./controlllers/blockchain-controller');

var blockchainControllerNode1 = new BlockchainController(blockchainServiceNode1);
var blockchainControllerNode2 = new BlockchainController(blockchainServiceNode2);
var blockchainControllerNode3 = new BlockchainController(blockchainServiceNode3);

app.use('/api/node1',  blockchainControllerNode1.api);
app.use('/api/node2',  blockchainControllerNode2.api);
app.use('/api/node3',  blockchainControllerNode3.api);

app.get('/', function(req, res) {
  req.is('html')
  res.send("<h1>Audit Election Api.</h1> <br /> <span>api/node1</span><br /> <span>api/node2</span><br /> <span>api/node3</span>");
});



app.listen(port, () => console.log(`Listening on port ${port}`));