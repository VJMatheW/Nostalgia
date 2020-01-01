const { objectsTbl, linkSharingTbl, linkSharingAuthTbl } = require('../../data-access')

const { NotificationService } = require('../../../Components')

const { makeAddLinkSharing } = require('./add-link-sharing')
const { makeAddLinkSharingRequest } = require('./add-link-sharing-request')
const { makeConfirmLinkSharingRequest } = require('./confirm-link-sharing-request')

const addLinkSharing = makeAddLinkSharing({ objectsTbl, linkSharingTbl })
const addLinkSharingRequest = makeAddLinkSharingRequest({ linkSharingTbl, linkSharingAuthTbl, NotificationService })
const confirmLinkSharingRequest = makeConfirmLinkSharingRequest({ linkSharingAuthTbl, NotificationService })

const linkSharingService = Object.freeze({
    addLinkSharing,
    addLinkSharingRequest,
    confirmLinkSharingRequest
})

module.exports = linkSharingService