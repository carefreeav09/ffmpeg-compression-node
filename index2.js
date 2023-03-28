const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

function compressVideos(directoryPath) {
  const directories = getDirectories(directoryPath);

  directories.forEach((directory) => {
    const files = fs.readdirSync(path.join(directoryPath, directory));
    files.forEach((file) => {
      const filePath = path.join(directoryPath, directory, file);
      if (isVideoFile(filePath)) {
        const outputFilePath = path.join(
          directoryPath,
          directory,
          `compressed-${file}`
        );
        const ffmpegProcess = spawn(
          ffmpegPath,
          [
            "-i",
            filePath,
            "-vcodec",
            "libx264",
            "-acodec",
            "aac",
            "-crf",
            "35",
            "-preset",
            "fast",
            "-f",
            "mp4",
            outputFilePath,
          ],
          {
            maxBuffer: 4 * 1024 * 1024 * 1024, // Limit memory usage to 10MB
          }
        );

        ffmpegProcess.stdout.on("data", (data) => {
          console.log(`ffmpeg stdout: ${data}`);
        });

        ffmpegProcess.stderr.on("data", (data) => {
          console.error(`ffmpeg stderr: ${data}`);
        });

        ffmpegProcess.on("close", (code) => {
          if (code === 0) {
            fs.unlinkSync(filePath);
            fs.renameSync(outputFilePath, filePath);
            console.log(`Compressed ${filePath}`);
          } else {
            console.error(`ffmpeg process exited with code ${code}`);
          }
        });
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

compressVideos("./to0");
