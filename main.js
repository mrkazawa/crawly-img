const fs = require('fs');
const request = require('request');

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

function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-GB", {
    timeZone: tzString
  }));
}

function getCurrentDateFormat() {
  let date_obj = new Date();
  convertedDate = convertTZ(date_obj, 'Europe/London');

  let date = ("0" + convertedDate.getDate()).slice(-2);
  let month = convertedDate.getMonth();
  let year = convertedDate.getFullYear();
  let hours = ("0" + convertedDate.getHours()).slice(-2);
  let minutes = ("0" + convertedDate.getMinutes()).slice(-2);
  let seconds = ("0" + convertedDate.getSeconds()).slice(-2);

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return date + ' ' + MONTH_NAMES[month] + ' ' + year + ' ' + hours + minutes + seconds;
}

async function main() {
  const IMAGE_URL = 'https://s3-eu-west-1.amazonaws.com/congestion-cameras/TCCT0338.jpg';
  const file_name = getCurrentDateFormat();

  await download(IMAGE_URL, `./images/${file_name}.jpg`);

  // recursive every 5 seconds
  //setTimeout(main, 5000);
}

console.log("Crawling for images...");
main();