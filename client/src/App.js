import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CertificatesPreview from './components/Certificates/CertificatesPreview';
import GenerateCertificates from './components/Generate_Certificates/generateCertificates';
import LandingPage from './components/Landing_Section/landingPage';
import MintCertificates from './components/Mint_Certificates/mintCertificates';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route
          path='/generateCertificates'
          element={<GenerateCertificates />}
        />
        <Route path='/preview' element={<CertificatesPreview />} />
        <Route path='/mintCertificates' element={<MintCertificates />} />
      </Routes>
    </Router>
  );
};

export default App;
