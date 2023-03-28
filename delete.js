const fs = require("fs");
const path = require("path");

function deleteCompressedFiles(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dirPath}: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for file ${filePath}: ${err}`);
          return;
        }

        if (stats.isDirectory()) {
          deleteCompressedFiles(filePath); // Recurse into subdirectory
        } else if (file.startsWith("compressed")) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}: ${err}`);
            } else {
              console.log(`Deleted file ${filePath}`);
            }
          });
        }
      });
    });
  });
}

deleteCompressedFiles("./to-do");
