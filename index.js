const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
ffmpeg.setFfmpegPath(ffmpegPath);
const { spawn } = require("child_process");

function compressVideos(directoryPath) {
  const directories = getDirectories(directoryPath);

  directories.forEach((directory) => {
    const files = fs.readdirSync(path.join(directoryPath, directory));
    while (files.length > 0) {
      const batch = files.splice(0, 10);
      batch.forEach((file) => {
        const filePath = path.join(directoryPath, directory, file);
        if (isVideoFile(filePath)) {
          const outputFilePath = path.join(
            directoryPath,
            directory,
            `compressed-${file}`
          );
          ffmpeg(filePath)
            .setFfmpegPath(ffmpegPath)
            .videoCodec("libx264")
            .audioCodec("aac")
            .outputOptions(["-crf 35", "-preset fast"])
            .outputFormat("mp4")
            .output(outputFilePath)
            .on("end", () => {
              fs.unlinkSync(filePath);
              fs.renameSync(outputFilePath, filePath);
              console.log(`Compressed ${filePath}`);
            })
            .run();
        }
      });
    }
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

compressVideos("./to-do");
