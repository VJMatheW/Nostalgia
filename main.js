const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// Require api
const api = require('./Server/api');

// Server setup
const PORT = (process.env.PORT || 5000);

// setting root directory
process.env.root = process.argv[2];

app.set('port', PORT);
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json({limit: '200mb', extended: true}));
app.use(express.urlencoded({limit: '200mb', extended: true}));

app.use('/api', api);

app.listen(app.get('port'), ()=>{
    console.log("Server listening on port : ", app.get('port'));
    console.log("Root Directory : ", process.env.root);
})