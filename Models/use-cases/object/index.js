const { HttpService } = require('../../../Components')

const { objectsTbl } = require('../../data-access')

const { makeAddObject }  = require('./add-object')
const { makeSelectObject } = require('./select-object')
const { makeGetImage } = require('./get-image')
const { makeDownloadObject } = require('./download-object')
const { makeIsAuthorized } = require('./is-authorized')

const addObject = makeAddObject({ objectsTbl })
const selectObject = makeSelectObject({ objectsTbl })
const getImage = makeGetImage({ objectsTbl, HttpService })
const downloadObject = makeDownloadObject({ objectsTbl })
const isAuthorized = makeIsAuthorized({ objectsTbl })

const objectService = Object.freeze({
    addObject,
    selectObject,
    getImage,
    downloadObject,
    isAuthorized
})

module.exports = objectService