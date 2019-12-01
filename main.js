const path = require('path');
const express = require('express');

const app = express();

// Require api
const api = require('./Server/api');

// Server setup
const PORT = (process.env.PORT || 5000);

// setting root directory
process.env.root = process.argv[2];

app.set('port', PORT);
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', api);

app.listen(app.get('port'), ()=>{
    console.log("Server listening on port : ", app.get('port'));
    console.log("Root Directory : ", process.env.root);
})