const conNormal = require('./database.js');
const conPromise = require('./databasePromise.js');
const movieListing = require('./moviedatabase');

let x = new conPromise();

module.exports = {
    'con': conNormal,
    'conPromise': x,
    'movieListing': movieListing
}