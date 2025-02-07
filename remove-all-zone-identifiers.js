const fs = require('fs');
const path = require('path');

function deleteZoneIdentifierFile(filePath) {
  const zoneFilePath = filePath + ':Zone.Identifier';

  fs.access(zoneFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
      console.log(`Deleting Zone.Identifier stream: ${zoneFilePath}`);
      fs.unlink(zoneFilePath, (err) => {
        if (err) {
          console.error(`Error deleting ${zoneFilePath}: ${err}`);
        } else {
          console.log(`Successfully deleted ${zoneFilePath}`);
        }
      });
    }
  });
}

function processDirectory(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dirPath}: ${err}`);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for ${fullPath}: ${err}`);
          return;
        }

        if (stats.isDirectory()) {
          processDirectory(fullPath); // Recurse into subdirectories
        } else {
          deleteZoneIdentifierFile(fullPath); // Check the file for Zone.Identifier
        }
      });
    });
  });
}

const rootDirectory = '../../'; // You can change this to the directory you want to start from
processDirectory(rootDirectory);
