import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import templates from './Templates';
import { Row } from 'react-bootstrap';
import jsPDF from 'jspdf';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';

const CertificatesPreview = () => {
  const zip = new JSZip();
  const location = useLocation();
  const { selectedRows, template } = location.state;
  console.log(selectedRows);
  const [textDrawProperties, setTextDrawProperties] = useState(
    templates[template - 1].text
  );
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const headers = [
    { label: 'FileHash', key: 'fileHash' },
    { label: 'WalletAddress', key: 'walletAddress' },
  ];

  const navigateToMint = () => {
    // 👇️ navigate to /contacts
    navigate('/mintCertificates', { replace: true });
  };

  useEffect(() => {
    for (let i = 0; i < selectedRows.length; i++) {
      let record = selectedRows[i];
      let imageObj = new Image();
      imageObj.src = `/templates/t${template}.png`;
      imageObj.onload = function () {
        let canvas = document.getElementById(`canvasCertificate${i}`);
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
        textDrawProperties.map((text, index) => {
          ctx.font = `${text.size}pt Inder`;
          ctx.fillStyle = 'black';
          ctx.fillText(record[text.title], text.x, text.y);
        });
      };
    }
  }, []);

  const downloadPdf = () => {
    document.getElementById('downloadButton').innerText = 'Downloading...';
    for (let i = 0; i < selectedRows.length; i++) {
      let canvas = document.getElementById(`canvasCertificate${i}`);
      let uri = canvas.toDataURL('png');
      let name = `${selectedRows[i].Enrollment}-${selectedRows[i].Name}`;
      let pdf = new jsPDF({ orientation: 'landscape' });
      let imgProps = pdf.getImageProperties(uri);
      let pdfWidth = pdf.internal.pageSize.getWidth();
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(uri, 'png', 0, 0, pdfWidth, pdfHeight);
      zip.file(`${name}.pdf`, pdf.output('blob'));
    }
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'certificates.zip');
      document.getElementById('downloadButton').innerText = 'Download as PDFs';
    });
  };

  const downloadAllPNGs = async () => {
    for (let i = 0; i < selectedRows.length; i++) {
      let canvas = document.getElementById(`canvasCertificate${i}`);
      let dataURL = canvas.toDataURL();
      let link = document.createElement('a');
      link.download = `${selectedRows[i]['Enrollment']}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const onAcceptPNGs = async (event) => {
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      formData.append('file', files[i]);
      let resFile = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: formData,
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
          'Content-Type': 'multipart/form-data',
        },
      });
      let ImgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
      alert(ImgHash);
      let name = files[i].name.split('.png')[0];
      for (let j = 0; j < selectedRows.length; j++) {
        if (selectedRows[j]['Enrollment'] == name) {
          setData((prev) => [
            ...prev,
            {
              fileHash: ImgHash,
              walletAddress: selectedRows[j]['Wallet Address'],
            },
          ]);
          break;
        }
      }
    }
  };

  const downloadCSV = () => {};

  return (
    <div>
      <Navbar />
      <div>
        <Row className='previewCertificates'>
          {selectedRows.map((row, index) => {
            return (
              <div key={index} className='certificatesContainer'>
                <canvas
                  className='canvasCertificates'
                  id={`canvasCertificate${index}`}
                ></canvas>
              </div>
            );
          })}
        </Row>
        <div
          className='downloadButtons'
          onClick={downloadPdf}
          id='downloadButton'
        >
          Download as PDFs
        </div>
        <div
          className='downloadButtons'
          onClick={downloadAllPNGs}
          id='downloadButton'
        >
          Download All Certificates as PNGs
        </div>
        <div className='inputAndButton'>
          <p className='importText'>Upload your PNGs to mint</p>
          <div className='importButton'>
            <label htmlFor='importPngs' style={{ cursor: 'pointer' }}>
              Browse
            </label>
            <input
              type='file'
              id='importPngs'
              name='certificates_pngs'
              accept='.png'
              onChange={onAcceptPNGs}
              style={{ display: 'none' }}
              multiple
            />
          </div>
        </div>
        <CSVLink className='downloadButtons' data={data} headers={headers}>
          Download Records
        </CSVLink>
        <div
          className='downloadButtons'
          onClick={navigateToMint}
          id='mintNavigateButton'
        >
          Mint NFT
        </div>
      </div>
    </div>
  );
};

export default CertificatesPreview;
