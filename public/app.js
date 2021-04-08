axios('http://localhost:5050/collect')
        .then(response => {
            console.log(response.data)
            document.querySelector('#exampleRes').innerHTML = JSON.stringify(response.data, undefined, 2)
        })



        