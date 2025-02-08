# Node Helpers Scripts

This directory contains various utility scripts to help with file management tasks in a Node.js environment. Below is a description of each script and its functionality.

## Scripts

### 1. remove-all-zone-identifiers.js

This script recursively processes a directory and deletes any `Zone.Identifier` streams associated with files. These streams are typically created by Windows when files are copied from Windows env to WSL.

#### Usage
1. Set the `rootDirectory` variable to the directory you want to start from.
2. Run the script using Node.js:
```sh
   node remove-all-zone-identifiers.js
```

2. node-backup-folders.js
This script recursively copies files from a source directory to a destination directory while respecting specified ignored patterns (e.g., .git, node_modules).

Usage
Set the SOURCE_DIRECTORY and DESTINATION_DIRECTORY variables to the desired paths.
Run the script using Node.js:
```sh
   node node-backup-folders.js
```

3. dump-all.envs.js
This script searches for .env and .env.example files up to a specified depth in the directory structure and archives them into a ZIP file.

Usage
Set the ROOT_DIRECTORY and MAX_DEPTH variables to the desired values.
Run the script using Node.js:
```sh
   node dump-all.envs.js
```

Common Functions
deleteZoneIdentifierFile(filePath)
Deletes the Zone.Identifier stream associated with a given file.

processDirectory(dirPath)
Recursively processes a directory, applying a specified function to each file.

shouldIgnore(entry)
Checks if a path matches any ignored pattern.

copyFilesRecursive(srcDir, destDir)
Recursively copies files from a source directory to a destination directory while respecting ignored patterns.

findTargetFiles(dir, depth, fileList)
Recursively finds specified files up to a specified depth.

createZipFile(targetFiles)
Archives target files while preserving their directory structure.

License
This project is licensed under the MIT License.