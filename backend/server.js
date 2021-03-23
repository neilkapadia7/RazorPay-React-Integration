const { response } = require('express');
const express = require('express')
const path = require('path')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();

app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
    key_id: 'rzp_test_bdxJH4MK5lnXD0',
    key_secret: 'q3s3gZGD5vlhIt5x8MQ3Pma0'
})

app.get('/', (req,res) => {
    res.send('Wecome to the Razorpay API');
})

app.get('/logo.svg', (req,res) => {
    res.sendFile(path.join(__dirname, 'logo.svg'));
})

app.post('/verification', (req, res) => {
    console.log(req.body)
    
    const secret = 'kairoshopping@21'

    const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
        res.status(502);
	}

    res.json({status: 'ok'})
})


app.post('/razorpay', async (req, res) => {
    
    const payment_capture =  1;
    const amount = 499;
    const currency = 'INR';

    const options = ({ 
        amount: (amount * 100), 
        currency, 
        receipt: Math.random(), 
        payment_capture
    })

    try {
        const response = await razorpay.orders.create(options)
        console.log(res)
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
        console.log(err);
    }
})


app.listen(5000, () => { console.log('Server Started on Port Number: 5000') })