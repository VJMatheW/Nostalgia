const crypto = require('crypto');
const { SanitationService } = require('../../Components');

const { buildUser } = require('./user')
const { buildObject } = require('./object')
const { buildLinkSharing } = require('./linksharing')
const { buildLinkSharingAuth } = require('./linksharingauth')

let sanitize = SanitationService.sanitize;

const makeUser = buildUser({ md5, sanitize })
const makeObject = buildObject()
const makeLinkSharing = buildLinkSharing()
const makeLinkSharingAuth = buildLinkSharingAuth()

exports.makeUser = makeUser
exports.makeObject = makeObject
exports.makeLinkSharing = makeLinkSharing
exports.makeLinkSharingAuth = makeLinkSharingAuth

function md5(text){
    return crypto
        .createHash('md5')
        .update(text, 'utf-8')
        .digest('hex')
}