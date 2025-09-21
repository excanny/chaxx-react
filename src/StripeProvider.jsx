import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51S9avsBTv37CskzN5kWMGTgEDc8i2ojIknSWTng3UWMQI8p9jK722V8FjFQbNsd4eVmNVp6lvusnIHRHgpgTpR9N00ZFCePnSX'); // Your Stripe Publishable Key

export default function StripeProvider({ children }) {
    return <Elements stripe={stripePromise}>{children}</Elements>;
}
