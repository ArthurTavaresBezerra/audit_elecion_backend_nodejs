module.exports = BlockchainService;

const Web3 = require('web3')
const Web3EthContract = require('web3-eth-contract');
const defaultAccount = "0x019b2231C3Cd4e4f3115ea69573014702D4cBb23"
const contractAddres = "0x063d736b73a9799d128088c9c02d3889bbe48255"
const contractInterface = JSON.parse('[{"constant":true,"inputs":[],"name":"getResult","outputs":[{"internalType":"uint256","name":"product","type":"uint256"},{"internalType":"uint256","name":"sum","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalCandidatos","outputs":[{"internalType":"uint256","name":"total","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"pidCandidato","type":"string"},{"internalType":"uint256","name":"puf","type":"uint256"},{"internalType":"uint256","name":"pcmun","type":"uint256"}],"name":"getTotalVotosPorCandidato","outputs":[{"internalType":"uint256","name":"total","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"pidBu","type":"string"},{"internalType":"string","name":"pidCandidato","type":"string"},{"internalType":"uint256","name":"puf","type":"uint256"},{"internalType":"uint256","name":"pcmun","type":"uint256"},{"internalType":"uint256","name":"pvoteCount","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]')

function BlockchainService(urlHttpNodeServer) {

    this.urlHttpNodeServer = urlHttpNodeServer;

    const web3 = new Web3(new Web3.providers.HttpProvider(this.urlHttpNodeServer));
    Web3EthContract.setProvider(urlHttpNodeServer);
    this.contractInstance = new web3.eth.Contract(contractInterface, contractAddres, {
        from: defaultAccount,
        gasPrice: '20000000000'
    });
    
    this.contractInstance.defaultAccount = defaultAccount 
    this.contractInstance.options.from = this.contractInstance.defaultAccount;
    this.contractInstance.options.gasPrice = '20000000000000';
    this.contractInstance.options.gas = 5000000; 
  
    console.log("-----------------------------------")
    console.log(this.contractInstance.options)
    console.log(this.contractInstance.defaultAccount)
    console.log(this.contractInstance.defaultBlock)
    console.log(web3.eth.Contract.transactionConfirmationBlocks)
    console.log("-----------------------------------")  

    this.accounts = async () => {
        return await web3.eth.getAccounts();
    };

    this.balance = async (addressAccount) => {
        return await web3.eth.getBalance(addressAccount);
    };

    this.totalCandidatos = async () => {
        return await this.contractInstance.methods.getTotalCandidatos().call().then( (total)=>{ return total }); 
    };

    this.totalVotosPorCandidato = async (idCandidate) => {
        return await this.contractInstance.methods.getTotalVotosPorCandidato(idCandidate,0,0).call().then( (total) => { return total });
    };

    this.vote = async (idBU, idCandidate, votes) => {

        return await this.contractInstance.methods.vote(idBU, idCandidate, 0, 0, votes).send()
                .on('transactionHash', function(hash){
                    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++transactionHash', hash); 
                })
                .on('confirmation', function(confirmationNumber, receipt){
                    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++confirmation', confirmationNumber); 
                })
                .on('receipt', function(receipt){ 
                    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++receipt', receipt); 
                })
                .on('error', function(error, receipt) { 
                    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++error', error); 
                });        
    }
}

// User.count = function(fn){
//   process.nextTick(function(){
//     fn(null, users.length);
//   });
// };
