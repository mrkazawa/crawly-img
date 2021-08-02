const fs = require("fs");
const {
  imageHash
} = require('image-hash');

const DIRECTORY = "./images/";
const hashes = new Set();

async function removeDuplicates() {
  const filenames = fs.readdirSync(DIRECTORY);
  filenames.forEach((file) => {
    //console.log("File:", file);

    const path = DIRECTORY + file;
    imageHash(path, 16, true, (error, data) => {
      if (error) throw error;

      if (hashes.has(data)) fs.unlinkSync(path);
      else hashes.add(data);
    });
  });
}

async function main() {
  await removeDuplicates();
  console.log('done removing duplicates!');
}

main();