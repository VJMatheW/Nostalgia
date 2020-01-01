const { makeUsersTbl } = require('./users-tbl')
const { makeObjectsTbl } = require('./objects-tbl')
const { makeLinkSharingTbl } = require('./linksharing-tbl')
const { makeLinkSharingAuthTbl } = require('./linksharingauth-tbl')

const { DatabaseService } = require('../../Components')

let db = DatabaseService.conPromise

exports.usersTbl = makeUsersTbl( { db } )
exports.objectsTbl = makeObjectsTbl({ db })
exports.linkSharingTbl = makeLinkSharingTbl({ db })
exports.linkSharingAuthTbl = makeLinkSharingAuthTbl({ db })