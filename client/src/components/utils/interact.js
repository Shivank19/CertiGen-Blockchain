import { pinJSONToIPFS } from './pinata.js';
// import { nftDetails } from '../Mint_Certificates/mintCertificates.js';
// require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../../contract-abi.json');
const contractAddress = '0x931cb666413039344a82fc991b1e5a2902142246';

export const mintNFT = async (url, name, walletAddress, description) => {
  //error handling
  if (
    url.trim() == '' ||
    name.trim() == '' ||
    walletAddress.trim() == '' ||
    description.trim() == ''
  ) {
    return {
      success: false,
      status: '❗Please make sure all fields are completed before minting.',
    };
  }

  //make metadata
  const metadata = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  //make pinata call
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: '😢 Something went wrong while uploading your tokenURI.',
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(), //make call to NFT smart contract
  };

  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    // web3.eth
    //   .getTransactionReceipt(
    //     '{txHash}'
    //   )
    //   .then(function (data) {
    //     let transaction = data;
    //     let logs = data.logs;
    //     console.log(logs);
    //     console.log(web3.utils.hexToNumber(logs[0].topics[3]));
    //   });

    return {
      success: true,
      status:
        'Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/' +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: 'Something went wrong: ' + error.message,
    };
  }
};

export const transferNFT = async (url, name, walletAddress, description) => {
  //error handling
  if (
    url.trim() == '' ||
    name.trim() == '' ||
    walletAddress.trim() == '' ||
    description.trim() == ''
  ) {
    return {
      success: false,
      status: '❗Please make sure all fields are completed before minting.',
    };
  }
};
