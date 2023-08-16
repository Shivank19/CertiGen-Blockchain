import React, { useEffect, useState } from 'react';
import csvParser from '../CSVParser/csvparser';
import Table from 'react-bootstrap/Table';
import Navbar from '../Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import cert1 from '../../assets/certificate1.png';
import cert2 from '../../assets/certificate2.png';
import cert3 from '../../assets/certificate3.png';
import { useAuth } from '../../Contexts/AuthContext';

const GenerateCertificates = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const [parsedColumns, setParsedColumns] = useState([]); // Will contain the table headers
  const [parsedRows, setParsedRows] = useState([]); // will contain the table rows
  const [selectedRows, setSelectedRows] = useState([]); // will contain selected rows by user
  const [fileName, setFileName] = useState(''); // name of the csv file
  const [template, setTemplate] = useState(null); // temple of the certificate

  // Whenever there will be changes to selectRows this will run
  /* It is made to make the select all checkbox true/false if
     user manually selects all the table rows or deselect all table rows*/
  useEffect(() => {
    if (document.getElementById('selectAll')) {
      if (selectedRows.length === parsedRows.length) {
        document.getElementById('selectAll').checked = true;
      } else {
        document.getElementById('selectAll').checked = false;
      }
    }
  }, [selectedRows]);

  // Redirect to login page if not authenticated
  if (!authUser.walletAddress) {
    navigate('/', { replace: true });
  }

  // Function will make the array to be rendered as table.
  const onChangeFile = (event) => {
    setFileName(event.target.files[0].name);
    const resultPromise = csvParser(event.target.files[0]);
    resultPromise
      .then((data) => {
        // Create array of all the table headers.
        // Each data item is a JSON Object.
        for (const property in data[0]) {
          setParsedColumns((prev) => [...prev, property]);
        }
        setParsedRows(data); // Create array of all table rows.
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Function to handle the selection/deselection of rows
  const changeSelection = (index, value) => {
    if (value) {
      /* Each selected row will be identified uniquely by the 
      index of the element in the parsedRows. */
      var obj = parsedRows[index];
      obj['index'] = index;
      setSelectedRows((prev) => [...prev, obj]);
    } else {
      setSelectedRows(selectedRows.filter((row) => row.index !== index));
    }
  };

  // Function to handle when 'Select All' will be clicked.
  // Each row's checkbox will be set to true/false depending upon current state.
  const changeSelectAll = (value) => {
    if (value) {
      for (let i = 0; i < parsedRows.length; i++) {
        if (!document.getElementById(`checkbox${i}`).checked) {
          let obj = parsedRows[i];
          obj['index'] = i;
          setSelectedRows((prev) => [...prev, obj]);
          document.getElementById(`checkbox${i}`).checked = true;
        }
      }
    } else {
      for (let i = 0; i < selectedRows.length; i++) {
        let index = selectedRows[i].index;
        document.getElementById(`checkbox${index}`).checked = false;
      }
      setSelectedRows([]);
    }
  };

  return (
    <div>
      <Navbar />
      {/* Choose Template */}
      <div className='inputAndButton'>
        <p className='importText'>Choose a Template</p>
      </div>
      <div className='templateRow'>
        <div className='templateCol'>
          <img
            src={cert1}
            className='template'
            value={1}
            onClick={() => setTemplate(1)}
          />
        </div>
        <div className='templateCol'>
          <img
            src={cert2}
            className='template'
            value={2}
            onClick={() => setTemplate(2)}
          />
        </div>
        <div className='templateCol'>
          <img
            src={cert3}
            className='template'
            value={3}
            onClick={() => setTemplate(3)}
          />
        </div>
      </div>

      {/* Input Data File */}
      <div className='inputAndButton'>
        <p className='importText'>Import your .csv file</p>
        <div className='importButton'>
          <label htmlFor='importInput' style={{ cursor: 'pointer' }}>
            Browse
          </label>
          <input
            type='file'
            id='importInput'
            name='students_file'
            accept='.csv'
            onChange={onChangeFile}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      {/* Only show the table when there is data to show */}
      {parsedColumns.length > 0 ? (
        <div className='parsedTableContainer'>
          <div className='parsedTableHeader'>
            <p className='parsedTableName'>{fileName}</p>
          </div>
          <Table responsive bordered className='parsedTable'>
            <thead>
              <tr>
                {parsedColumns.map((column, index) => {
                  return <th key={index}>{column}</th>;
                })}
                <th>
                  <input
                    type='checkbox'
                    id='selectAll'
                    className='form-check-input'
                    onChange={(event) => {
                      changeSelectAll(event.target.checked);
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Parsing the table with dynamic columns and table entries */}
              {parsedRows.map((row, index) => {
                return (
                  <tr key={index}>
                    {parsedColumns.map((column, ind) => {
                      return <td key={ind}>{row[column]}</td>;
                    })}
                    <td>
                      {/* Each checkbox input will have unique id */}
                      <input
                        id={`checkbox${index}`}
                        type='checkbox'
                        className='form-check-input'
                        onChange={(event) => {
                          changeSelection(index, event.target.checked);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      <div className='inputAndButton generateButton'>
        <Link
          to='/preview'
          state={{ selectedRows: selectedRows, template: template }}
        >
          <p className='generateText'>Generate Certificates</p>
        </Link>
      </div>
    </div>
  );
};

export default GenerateCertificates;
