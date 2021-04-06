const express = require('express');
const app = express();
const axios = require("axios")



const endpoint = 'https://api.thegraph.com/subgraphs/name/nimbus-devs/nimbus-subgraph'
const query = `
{
    nimbusFactories {
      id
      txCount
      pairCount
      totalVolumeUSD
      totalVolumeNBU
    }
    pairs{
      id
      txCount
      createdAtBlockNumber
    }
    
  }
`

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(5050);
console.log('http://localhost:5050/')    

app.get('/data', (req, res) => {
    axios({
        url: endpoint,
        method: 'post',
        data: {
          query: query
        }
      }).then((result) => {
        const data = result.data
        res.json({data})
      })
})

    
      