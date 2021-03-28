const { Client } = require('pg');

async function connect(){
    const client = new Client({
        user: 'hrportal',
        host: '54.213.209.125',
        database: 'hrportal',
        password: 'drillbox2',
        port: 3211,
      })
      client.connect()
      client.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        client.end()
      })
}

connect();