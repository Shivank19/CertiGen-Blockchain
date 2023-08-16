import React, { useState } from 'react';
import bg from '../../assets/bg.jpg';
import logo from '../../assets/website-logo-home.png';

import LoginForm from './LoginForm';

const LandingPage = () => {
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleShowLogin = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin);
  };

  return (
    <div>
      <LoginForm isShowLogin={isShowLogin} handleShowLogin={handleShowLogin} />

      <div className='landingBody'>
        <div className='backgroundImage'></div>
        <div className='text'>
          <img src={logo} className='homeLogo' alt='logo' />
          <h1 className='title__text'>CertiGen</h1>
          <p className='title__desc'>
            Generate Certificates of your template and distribute them as NFTs.
          </p>
          <div className='login'>
            <button className='btn__login' onClick={handleShowLogin}>
              Get Started
            </button>
          </div>
        </div>
        <div className='image'>
          <img src={bg} className='demoCertificate' alt='certificate demo' />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
