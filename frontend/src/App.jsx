import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/customer/Home';
import ProvidersList from './pages/customer/ProvidersList';
import ProviderProfile from './pages/customer/ProviderProfile';
import BookingPage from './pages/customer/BookingPage';
import Services from './pages/public/Services';
import HowItWorksPage from './pages/public/HowItWorksPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import EditProviderProfile from './pages/provider/EditProviderProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PromoBanner from './components/layout/PromoBanner';

function App() {
  return (
    <>
      <PromoBanner />
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/services" element={<Services />} />
      <Route path="/providers" element={<ProvidersList />} />
      <Route path="/providers/:id" element={<ProviderProfile />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/book/:providerId" element={<BookingPage />} />
      
      {/* Protected Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      </Route>
      
      {/* Protected Provider Routes */}
      <Route element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/profile" element={<EditProviderProfile />} />
      </Route>
      
      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
    </>
  )
}

export default App;
