// import React, { useState } from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// export default function PaymentForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [customerName, setCustomerName] = useState('');
//   const [customerEmail, setCustomerEmail] = useState('');
//   const [serviceId, setServiceId] = useState(1);
//   const [amount, setAmount] = useState(20);
//   const [payNow, setPayNow] = useState(false);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     let paymentMethodId = null;

//     if (payNow) {
//       // Create PaymentMethod if user wants to pay now
//       const card = elements.getElement(CardElement);
//       const { error, paymentMethod } = await stripe.createPaymentMethod({
//         type: 'card',
//         card,
//       });

//       if (error) {
//         setMessage(error.message);
//         setLoading(false);
//         return;
//       }

//       paymentMethodId = paymentMethod.id;
//     }

//     // Call Laravel API
//     try {
//       const response = await fetch('http://localhost:8000/api/bookings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           customer_name: customerName,
//           customer_email: customerEmail,
//           service_id: serviceId,
//           amount,
//           pay_now: payNow,
//           payment_method_id: paymentMethodId,
//         }),
//       });

//       const data = await response.json();

//       if (data.booking) {
//         setMessage('Booking created successfully!');
//       } else if (data.client_secret) {
//         // Handle 3D Secure / payment confirmation
//         const confirmResult = await stripe.confirmCardPayment(data.client_secret);
//         if (confirmResult.paymentIntent.status === 'succeeded') {
//           setMessage('Payment successful and booking created!');
//         } else {
//           setMessage('Payment failed or requires action.');
//         }
//       } else if (data.error) {
//         setMessage(data.error);
//       }
//     } catch (err) {
//       setMessage(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
//       <h2>Book a Service</h2>

//       <input
//         type="text"
//         placeholder="Your Name"
//         value={customerName}
//         onChange={(e) => setCustomerName(e.target.value)}
//         required
//       />
//       <input
//         type="email"
//         placeholder="Email"
//         value={customerEmail}
//         onChange={(e) => setCustomerEmail(e.target.value)}
//         required
//       />
//       <input
//         type="number"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         required
//       />

//       <label>
//         <input
//           type="checkbox"
//           checked={payNow}
//           onChange={(e) => setPayNow(e.target.checked)}
//         />
//         Pay Now
//       </label>

//       {payNow && <CardElement options={{ hidePostalCode: true }} />}

//       <button type="submit" disabled={loading || (payNow && !stripe)}>
//         {loading ? 'Processing...' : 'Book'}
//       </button>

//       {message && <div>{message}</div>}
//     </form>
//   );
// }
