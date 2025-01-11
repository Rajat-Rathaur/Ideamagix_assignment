import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DoctorSignUp from './pages/DoctorSignUp'; // Example components
import DoctorSignIn from './pages/DoctorSignIn';
import PatientSignUp from './pages/PatientSignUp';
import PatientSignIn from './pages/PatientSignIn';
import DoctorHome from './components/DoctorHome';
import PatientHome from './components/PatientHome';
import ProtectedRoute from './pages/ProtectedRoute';
import Error from './components/Error';
import DoctorConsultation from './components/DoctorConsultation';
import PatientPrescription  from './components/PatientPrescription';
import PatientProfile from './pages/PatientProfile';
import DoctorPrescription from './components/DoctorPrescription';
function App() {
  return (
    // Wrap your entire app with Router
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor/signup" element={<DoctorSignUp />} />
        <Route path="/doctor/signin" element={<DoctorSignIn />} />
        <Route path="/patient/signup" element={<PatientSignUp />} />
        <Route path="/patient/signin" element={<PatientSignIn />} />
      
        <Route path="*" element={<Error />} />
        <Route
            path="/doctor/home"
            element={<ProtectedRoute element={<DoctorHome />} />}
          />
          <Route
            path="/patient/home"
            element={<ProtectedRoute element={<PatientHome />} />}
          />
           <Route
            path="/consultation/:doctorId"
            element={<ProtectedRoute element={<DoctorConsultation />} />}
          />
                 <Route
            path="/prescriptions/doctor/:doctorId"
            element={<ProtectedRoute element={<PatientPrescription  />} />}
          />
          <Route
            path="/patient/profile/:id"
            element={<ProtectedRoute element={<PatientProfile />} />}
            />
            <Route
            path="/doctor/prescription"
            element={<ProtectedRoute element={<DoctorPrescription />} />}
          />
      </Routes>
    </Router>
  );
}

export default App;
