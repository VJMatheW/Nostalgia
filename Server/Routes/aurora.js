const router = require('express').Router();

router.post('/billing_app',async (req, res)=>{
    console.log(req.body)

    res.status(200).json({
        hostname : 'colorhomes.ddns.net',
        port : '8081'
    })
})

module.exports = router;