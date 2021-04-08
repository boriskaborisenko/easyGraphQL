const express = require('express');
const app = express();
const axios = require("axios")
const moment = require("moment")

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.use('/public', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));


app.listen(5050);
console.log('http://localhost:5050/ — ')    


app.get('/collect', (req, res) => {
  const endpoint = 'https://api.thegraph.com/subgraphs/name/nimbus-devs/nimbus-subgraph'
  const query = (first, skip) => {
    return  `
  {swaps(first: ${first}, skip:${skip}, orderBy: timestamp, orderDirection: desc) {
    
    transaction {
      id
      timestamp
      __typename
    }
    pair {
      token0 {
        id
        symbol
        __typename
      }
      token1 {
        id
        symbol
        __typename
      }
    __typename
    }
    amount0In
    amount0Out
    amount1In
    amount1Out
    amountUSD
    to
    timestamp
    __typename
  }
  }

    
  `
  }
  const now = moment()

  let allSwaps = []

  const stop = (end) => {
    res.json({time:`Collect data in ${end.diff(now)/1000} seconds`,totalSwaps: allSwaps.length, collect:allSwaps})
  }

  let iter = 0

    const getPart = async (qty, skip) => {
      
      const res = async () => await axios({
        url: endpoint,
        method: 'post',
        data: {
          query: query(qty, skip)
        }
      }).then((result) => {
        return result.data.data.swaps
      }) 
      
      let getSwaps = await res(qty, skip)
      if(getSwaps.length > 0){
        iter++
        allSwaps.push(getSwaps)
        getPart(1000,1000*iter)
      }else{
        allSwaps = allSwaps.reverse().concat.apply([], allSwaps)
        stop(moment())
      }
    }

    getPart(1000,0)
})







    
      