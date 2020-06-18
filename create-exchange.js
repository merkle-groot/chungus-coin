
let Web3 = require("web3");
const Tx = require('ethereumjs-tx')

var abi = '[{"name":"NewExchange","inputs":[{"type":"address","name":"token","indexed":true},{"type":"address","name":"exchange","indexed":true}],"anonymous":false,"type":"event"},{"name":"initializeFactory","outputs":[],"inputs":[{"type":"address","name":"template"}],"constant":false,"payable":false,"type":"function","gas":35725},{"name":"createExchange","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"token"}],"constant":false,"payable":false,"type":"function","gas":187911},{"name":"getExchange","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"token"}],"constant":true,"payable":false,"type":"function","gas":715},{"name":"getToken","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"exchange"}],"constant":true,"payable":false,"type":"function","gas":745},{"name":"getTokenWithId","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"uint256","name":"token_id"}],"constant":true,"payable":false,"type":"function","gas":736},{"name":"exchangeTemplate","outputs":[{"type":"address","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":633},{"name":"tokenCount","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":663}]'

let web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/3807691b19f247bf8de7b5822c31fb24"));
// the account address that will send the test transaction
const addressFrom = '0xbA3a9d03C0d2E330279f5ca92E2aD5af7083BB26'
const privKey = "3d1e49923912999811b49cde8862dc701d7493878ecd9c4e5937c5cb57444843";
// the Uniswap factory contract address
const addressTo = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const contract = new web3.eth.Contract(JSON.parse(abi), addressTo);
const tx = contract.methods.createExchange('0xbA3a9d03C0d2E330279f5ca92E2aD5af7083BB26');
const encodedABI = tx.encodeABI();

function sendSigned(txData, cb) {
  const privateKey = new Buffer.alloc(privKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}
// get the number of transactions sent so far so we can create a fresh nonce
web3.eth.getTransactionCount(addressFrom).then(txCount => {
  // construct the transaction data
  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000),
    to: addressTo,
    from: addressFrom,
    data: encodedABI
  }
  // fire away!
  sendSigned(txData, function(err, result) {
    if (err) return console.log('error', err)
    console.log('sent', result)
  })
})