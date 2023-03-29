const path = require("path");
const fs = require("fs");

function addMp4Extension(directoryPath) {
  const directories = getDirectories(directoryPath);

  directories.forEach((directory) => {
    const files = fs.readdirSync(path.join(directoryPath, directory));
    files.forEach((file) => {
      const filePath = path.join(directoryPath, directory, file);

      if (isVideoFile(filePath)) {
        const fileExtension = path.extname(filePath);
        if (!fileExtension) {
          const newFilePath = `${filePath}.mp4`;
          fs.renameSync(filePath, newFilePath);
        }
      }
    });
  });
}

function getDirectories(path) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function isVideoFile(filePath) {
  const fileName = path.basename(filePath);
  return !fileName.includes("-thumbnail");
}

addMp4Extension("./videos");
