import React, { useContext, useEffect } from 'react';
import { AccountCircle } from '@mui/icons-material';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

const Navbar = () => {
  const { authUser, setAuthUser } = useAuth();
  // console.log('Hello', authUser);
  const navigate = useNavigate();

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=''
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ));

  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      return (
        <div
          ref={ref}
          style={style}
          className={`${className} dropDownMenu`}
          aria-labelledby={labeledBy}
        >
          <ul className='list-unstyled'>{React.Children.toArray(children)}</ul>
        </div>
      );
    }
  );

  const navigateToHome = () => {
    navigate('/', { replace: true });
  };
  return (
    <div className='navbarContainer'>
      <div className='logoWebsite' onClick={navigateToHome}>
        <img
          className='logoWebsiteImage'
          src='/images/website-logo.png'
          alt='websiteLogo'
        />
      </div>
      <div className='profileNavbar'>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'>
            <AccountCircle className='profileIcon' />
          </Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu}>
            <p className='helloDropDown'>
              {'Connected: ' +
                String(authUser.walletAddress).substring(0, 6) +
                '...' +
                String(authUser.walletAddresswalletAddress).substring(38)}
            </p>
            <Dropdown.Item eventKey='1'>
              <Link className='linkDropDown' to='/'>
                Open Etherscan
              </Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey='2'>
              <Link className='linkDropDown' to='/generateCertificates'>
                Generate Certificates
              </Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey='3'>
              <Link className='linkDropDown' to='/mintCertificates'>
                Mint and Send
              </Link>
            </Dropdown.Item>

            <Dropdown.Item eventKey='4'>
              <Link className='linkDropDown' to='/'>
                Home
              </Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
