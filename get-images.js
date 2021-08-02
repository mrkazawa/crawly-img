const fs = require('fs');
const request = require('request');

// parameters
const IMAGE_URL = 'https://s3-eu-west-1.amazonaws.com/congestion-cameras/TCCT0338.jpg';
const DURATION = 30000; // in milliseconds

async function download(url, dest) {
  const file = fs.createWriteStream(dest);

  await new Promise((resolve, reject) => {
      request({
          uri: url,
          gzip: true,
        })
        .pipe(file)
        .on('finish', async () => {
          //console.log(`The file is finished downloading.`);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    })
    .catch((error) => {
      console.log(`Something happened: ${error}`);
    });
}

function convertTimezone(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-GB", {
    timeZone: tzString
  }));
}

function getCurrentDateFormat() {
  let date_obj = new Date();
  converted_date = convertTimezone(date_obj, 'Europe/London');

  let date = ("0" + converted_date.getDate()).slice(-2);
  let month = converted_date.getMonth();
  let year = converted_date.getFullYear();
  let hours = ("0" + converted_date.getHours()).slice(-2);
  let minutes = ("0" + converted_date.getMinutes()).slice(-2);
  let seconds = ("0" + converted_date.getSeconds()).slice(-2);

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return date + ' ' + MONTH_NAMES[month] + ' ' + year + ' ' + hours + minutes + seconds;
}

async function main() {
  const file_name = getCurrentDateFormat();
  const path = `./images/${file_name}.jpg`;

  await download(IMAGE_URL, path);

  // recursive every a given interval
  setTimeout(main, DURATION);
}

console.log("Crawling for images...");
main();