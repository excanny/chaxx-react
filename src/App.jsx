import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import AdminLogin from "./components/AdminLogin";
import NotFound from "./components/NotFound";
import AdminDashboard from './components/AdminDashboard';
//import PaymentForm from './PaymentForm';
//import StripeProvider from './StripeProvider'; // import the StripeProvider

export default function App() {
  return (
    // <StripeProvider>
      <Router>
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              {/* <Route path="/book" element={<PaymentForm />} />  */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    // </StripeProvider>
  );
}
