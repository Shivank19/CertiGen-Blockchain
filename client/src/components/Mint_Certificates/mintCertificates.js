// 0x931cB666413039344a82FC991B1E5a2902142246 Contract Addess
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import csvParser from '../CSVParser/csvparser';
import Navbar from '../Navbar/Navbar';
import { mintNFT } from '../utils/interact.js';

const MintCertificates = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('');
  const [nftDetails, setNftDetails] = useState({
    name: '',
    fileHash: '',
    walletAddress: '',
    description: '',
  });
  const [fileRecords, setFileRecords] = useState([]);

  // Redirect to login page if not authenticated

  if (!authUser.walletAddress) {
    navigate('/', { replace: true });
  }

  //TO DO: Pass values from form field to mintNFT, can't understand
  const onMintPressed = async () => {
    var url = nftDetails.fileHash;
    var wa = nftDetails.walletAddress;
    var desc = nftDetails.description;
    var name = nftDetails.name;
    const { status } = await mintNFT(url, name, wa, desc);
    setStatus(status);
    console.log(status);
    alert(
      status + '\nPlease go to the link and note the token ID for transfer'
    );
  };

  const handleChangeInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setNftDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onChangeFile = (event) => {
    const file = event.target.files[0];
    const resultPromise = csvParser(file);
    resultPromise
      .then((data) => {
        // Create array of all the file hashes.
        // Each data item is a JSON Object.
        console.log(data);
        setFileRecords(data); // Create array of all file hashes.
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fillHashInForm = (index) => {
    setNftDetails((prev) => {
      return {
        ...prev,
        fileHash: fileRecords[index].FileHash,
        walletAddress: fileRecords[index].WalletAddress,
      };
    });
  };

  return (
    <div>
      <Navbar />
      <div className='mintingSection'>
        <div className='leftSide'>
          <div className='leftSideHeading'>Mint & Send NFTs</div>
          <form>
            <div>
              <input
                className='inputField'
                type='text'
                name='name'
                value={nftDetails.name}
                autoComplete='false'
                placeholder='Name of the NFT'
                onChange={(event) => {
                  handleChangeInput(event);
                }}
              />
            </div>
            <div>
              <input
                className='inputField'
                type='text'
                name='fileHash'
                value={nftDetails.fileHash}
                autoComplete='false'
                placeholder='IPFS File Hash'
                onChange={(event) => {
                  handleChangeInput(event);
                }}
              />
            </div>
            <div>
              <input
                className='inputField'
                type='text'
                name='walletAddress'
                value={nftDetails.walletAddress}
                autoComplete='false'
                placeholder='Wallet Address to send NFT'
                onChange={(event) => {
                  handleChangeInput(event);
                }}
              />
            </div>
            <div>
              <input
                className='inputField'
                type='text'
                name='description'
                value={nftDetails.description}
                autoComplete='false'
                placeholder='Description of NFT'
                onChange={(event) => {
                  handleChangeInput(event);
                }}
              />
            </div>
            <button
              type='button'
              className='mintAndSendButton'
              onClick={onMintPressed}
            >
              <p className='generateText'>Mint</p>
            </button>
            <button
              type='button'
              className='mintAndSendButton'
              // onClick={}
            >
              <p className='generateText'>Transfer</p>
            </button>
          </form>
        </div>
        <div className='rightSide'>
          <div className='importFileHashes'>
            <p className='importFileHashText'>Import file hashes CSV</p>
            <div className='importFileHashButton'>
              <label
                htmlFor='importFileHashInput'
                style={{ cursor: 'pointer' }}
              >
                Browse
              </label>
              <input
                type='file'
                id='importFileHashInput'
                name='file_hashes'
                accept='.csv'
                onChange={(event) => {
                  onChangeFile(event);
                }}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          {fileRecords.length > 0 ? (
            <div className='displayFileHashes'>
              {fileRecords.map((file, index) => {
                return (
                  <div
                    key={index}
                    className='fillHashContainer'
                    onClick={() => {
                      fillHashInForm(index);
                    }}
                  >
                    <p className='fileHashText'>{file.WalletAddress}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MintCertificates;
