import React, {useState} from 'react'
import logo from './logo.svg';
import './App.css';

function App() {

  const [name, setName] = useState('Neil Kapadia')
  const [email, setEmail] = useState('neilkapadia7@gmail.com')
  const [contact, setContact] = useState('9167558372')

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true) 
      }
      script.onerror = () => {
        resolve(false)
      }

      document.body.appendChild(script)
    })
  }

  const __DEV__ = document.domain === 'localhost'

  


  const displayRazorPay = async () => {
    
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if(!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const data = await fetch
      ('http://localhost:5000/razorpay', 
      { method: 'POST' })
      .then((t) =>
			    t.json()
		)
    
    console.log(data);

    const options = {
      "key": __DEV__ ? 'rzp_test_bdxJH4MK5lnXD0' : 'PRODUCTION_KEY', // Enter the Key ID generated from the Dashboard
      "amount": data.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": data.currency,
      "name": "Kairo Shopping",
      "description": "Thank you for Choosing Kairo Shopping",
      "image": "https://example.com/your_logo",
      "order_id": data.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": function (response){
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature)
      },
      "prefill": {
          "name": name,
          "email": email,
          "contact": contact
      },
      "theme": {
          "color": "#3399cc"
      }
    }

    var paymentObject = new window.Razorpay(options);
    paymentObject.open()
  }

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          onClick={displayRazorPay}
          target="_blank"
          rel="noopener noreferrer"
        >
          Donate Rs.5
        </a>
      </header>
    </div>
  );
}

export default App;
