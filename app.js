const fs = require("fs");
const http = require("http");

const args = process.argv.slice(2);

const ARTICLE_NUMBER = args[0] || `1392`;
const STARTING_PAGE_NUMBER = +args[1] || 1;
const FILE_FORMAT = args[2] || `jpg`;
const BASE_URL = `http://privrednastampa.ba/ZIPS/${ARTICLE_NUMBER}/files/mobile`;
const DEST_DIR_PATH = `./output/${ARTICLE_NUMBER}`;

console.log(`ARTICLE_NUMBER: `, ARTICLE_NUMBER);
console.log(`STARTING_PAGE_NUMBER: `, STARTING_PAGE_NUMBER);
console.log(`FILE_FORMAT: `, FILE_FORMAT);
console.log(``);

const downloadAndSaveFile = (url, dest, onSuccess, onError) => {
  http
    .get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        if (onError) onError(response);
        return;
      }

      const file = fs.createWriteStream(dest, null);
      response.pipe(file);

      file.on(`finish`, () => {
        file.close(onSuccess);
      });
    })
    .on(`error`, error => {
      //fs.unlink(dest);
      if (onError) onError(error);
    });
};

const next = (pageNumber, retryCounter) => {
  const fileSourceUrl = BASE_URL + `/${pageNumber}.${FILE_FORMAT}`;
  const fileDestPath = DEST_DIR_PATH + `/${pageNumber}.${FILE_FORMAT}`;

  if (fs.existsSync(fileDestPath)) {
    console.log(`skipping file (already exists): `, fileDestPath);
    setTimeout(() => {
      next(pageNumber + 1, 0);
    });
    return;
  }

  console.log(``);
  console.log(`Downloading: `, fileSourceUrl);
  downloadAndSaveFile(
    fileSourceUrl,
    fileDestPath,
    () => {
      console.log(`Downloaded: `, fileSourceUrl);
      setTimeout(() => {
        // wait 1s before new download - prevent overloading the server
        next(pageNumber + 1, 0);
      }, 1000);
    },
    error => {
      if (error && error.statusCode === 404) {
        console.log(`File not found: `, fileSourceUrl);
        console.log(``);
        console.log(`Done ^^`);
        return;
      }

      console.error(`Error downloading file: `, fileSourceUrl);

      if (retryCounter > 1) {
        console.log(``);
        console.log(`Finishing with errors for file: `, fileSourceUrl);
        console.log(`Try completing the download later...`);
        return;
      }

      console.log(``);
      console.log(`Retrying...`);

      setTimeout(() => {
        next(pageNumber, retryCounter + 1);
      }, 5000);
    }
  );
};

const run = () => {
  console.log(`Starting..`);
  console.log(``);

  if (!fs.existsSync(DEST_DIR_PATH)) {
    fs.mkdirSync(DEST_DIR_PATH);
  }

  next(STARTING_PAGE_NUMBER, 0);
};

run();
