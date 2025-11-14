const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const MAX_DEPTH = 3 // Set your desired depth
const ROOT_DIRECTORY = '.' // Starting point for the search
const OUTPUT_ZIP_FILE = 'env_files_backup.zip'

// Folders to ignore
const IGNORED_FOLDERS = ['.git', 'node_modules', 'docker_volumes', 'dist', 'docker-volumes', 'docker_volumes_igortrindade_os']

// Files to dump
const FILES_TO_DUMP = ['.env', '.env.example']

/**
 * Recursively find specified files up to the specified depth
 */
function findTargetFiles(dir, depth, fileList = []) {
  if (depth < 0) return fileList

  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return fileList

  const entries = fs.readdirSync(dir)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)

    console.log(entry)

    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORED_FOLDERS.some((i) => entry.includes(i))) {
        findTargetFiles(fullPath, depth - 1, fileList)
      }
    } else if (FILES_TO_DUMP.includes(entry)) {
      fileList.push(fullPath)
    }
  }

  return fileList
}

/**
 * Archive target files while preserving their directory structure
 */
function createZipFile(targetFiles) {
  const output = fs.createWriteStream(OUTPUT_ZIP_FILE)
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', () => {
    console.log(`Zip file created: ${OUTPUT_ZIP_FILE}`)
    console.log(`Total size: ${archive.pointer()} bytes`)
  })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  targetFiles.forEach((filePath) => {
    const relativePath = path.relative(ROOT_DIRECTORY, filePath)
    archive.file(filePath, { name: relativePath })
  })

  archive.finalize()
}

/**
 * Main execution function
 */
function main() {
  console.log(`Searching for target files in "${ROOT_DIRECTORY}" up to depth ${MAX_DEPTH}...`)
  
  const targetFiles = findTargetFiles(ROOT_DIRECTORY, MAX_DEPTH)

  if (targetFiles.length === 0) {
    console.log('No target files found')
  } else {
    console.log(`Found ${targetFiles.length} target file(s):`)
    targetFiles.forEach(file => console.log(`- ${file}`))

    createZipFile(targetFiles)
  }
}

main()