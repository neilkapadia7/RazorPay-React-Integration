const { response } = require('express');
const express = require('express')
const path = require('path')
const Razorpay = require('razorpay')
const cors = require('cors')

const app = express();

app.use(cors())

const razorpay = new Razorpay({
    key_id: 'rzp_test_bdxJH4MK5lnXD0',
    key_secret: 'q3s3gZGD5vlhIt5x8MQ3Pma0'
})

app.get('/logo.svg', (req,res) => {
    res.sendFile(path.join(__dirname, 'logo.svg'));
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