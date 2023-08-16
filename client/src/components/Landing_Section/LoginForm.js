import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

const LoginForm = (props) => {
  const { authUser, changeValue } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    username: '',
  });

  // Redirect to login page if not authenticated
  if (authUser.walletAddress) {
    navigate('/generateCertificates', { replace: true });
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (window.ethereum) {
      try {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((accounts) => {
            const account = accounts[0];
            changeValue('walletAddress', account);
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('First install MetaMask in your browser');
    }
  };

  return (
    <Modal
      className='loginFormModalBody'
      size='md'
      show={props.isShowLogin}
      onHide={props.handleShowLogin}
      centered
    >
      <Modal.Title
        className='formHeadingText'
        id='contained-modal-title-vcenter'
      >
        Sign Up
      </Modal.Title>
      <Modal.Body>
        <form onSubmit={(event) => handleLogin(event)}>
          <div>
            <input
              type='text'
              placeholder='Email'
              name='email'
              value={data.email}
              className='inputFieldForm'
              autoComplete='false'
              onChange={(event) => {
                handleChange(event);
              }}
            />
          </div>
          <div>
            <input
              type='text'
              placeholder='Username'
              name='username'
              value={data.username}
              className='inputFieldForm'
              autoComplete='false'
              onChange={(event) => {
                handleChange(event);
              }}
            />
          </div>
          <button type='submit' className='MetaMaskConnectButton'>
            <p className='MetaMaskConnectText'>Connect to MetaMask</p>
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginForm;
