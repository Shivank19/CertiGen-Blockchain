import Papa from 'papaparse';

/* Will return a promise, which on being resolved will
   give the desired data in array of JSON objects.*/
const csvParser = (file) => {
  var promise = new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (parsedFile) => {
        resolve(parsedFile.data);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
  return promise;
};

export default csvParser;
