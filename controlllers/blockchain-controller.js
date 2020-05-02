const express = require('express');

function BlockchainController(blockchainService) {
    this.blockchainService = blockchainService;

    this.api = express.Router();

    this.api.get('/balancos', async (req, res) => {

      var balancos = [];
    
      await this.blockchainService.accounts().then(async (accounts)=>{  
        for ( account of accounts) {
          var balanco = await blockchainService.balance(account)
          balancos.push({account, balanco})    
        };
      })
      res.send(balancos);
    });
 
    this.api.get('/total-candidatos', async (req, res) => {
      const total = await this.blockchainService.totalCandidatos();
      res.send({ total });
    });
    
    this.api.get('/total-votos-por-candidato/:id', async (req, res) => {
      const total = await this.blockchainService.totalVotosPorCandidato(req.params.id);
      res.send({ total });
    });
    
    this.api.get('/vote/:idpu/:idcandidate/:votes', async (req, res) => {
      console.log(req.params)
      await this.blockchainService.vote(req.params.idpu, req.params.idcandidate, req.params.votes);
      res.send({ OK : true });
    });


  }


module.exports = BlockchainController;
  
