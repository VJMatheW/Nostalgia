const { HttpService } = require('../../../Components')

const { objectsTbl } = require('../../data-access')

const { makeAddObject }  = require('./add-object')
const { makeSelectObject } = require('./select-object')
const { makeGetImage } = require('./get-image')
const { makeDownloadObject } = require('./download-object')
const { makeIsAuthorized } = require('./is-authorized')
const { makeDeleteImage } = require('./delete-image')

const addObject = makeAddObject({ objectsTbl })
const selectObject = makeSelectObject({ objectsTbl })
const getImage = makeGetImage({ objectsTbl, HttpService })
const downloadObject = makeDownloadObject({ objectsTbl })
const isAuthorized = makeIsAuthorized({ objectsTbl })
const deleteImage = makeDeleteImage({ objectsTbl })

const objectService = Object.freeze({
    addObject,
    selectObject,
    getImage,
    downloadObject,
    isAuthorized,
    deleteImage
})

module.exports = objectService