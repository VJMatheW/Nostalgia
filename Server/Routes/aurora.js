const router = require('express').Router();

router.post('/billing_app',async (req, res)=>{
    /**
        body = {
            from : 'billme',
            shop : 'shop name',
            content : 'invoice and invoice_items data'
        }
     */
    let data = req.body;
    data.content = JSON.parse(decodeURIComponent(req.body.content))
    console.log(data)

    res.status(200).json({
        hostname : 'colorhomes.ddns.net',
        port : '8081'
    })
})

module.exports = router;