const fs = require('fs')
const path = require('path')

const SOURCE_DIRECTORY = '.' // Directory to copy from
const DESTINATION_DIRECTORY = './backup' // Destination directory

// Patterns to ignore (folders or files)
const IGNORED_PATTERNS = ['.git', 'node_modules', 'docker_volumes', 'dist', 'build', '.history', '.lh', 'docker-volumes', 'docker_volumes_igortrindade_os', 'vendor', 'old', 'backup']

/**
 * Check if a path matches any ignored pattern
 */
function shouldIgnore(entry) {
  return IGNORED_PATTERNS.some(pattern => entry.includes(pattern))
}

/**
 * Copy files recursively while respecting ignored patterns
 */
function copyFilesRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir) || shouldIgnore(path.relative(SOURCE_DIRECTORY, srcDir))) return

  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    const entries = fs.readdirSync(srcDir)

    entries.forEach(entry => {
      const srcPath = path.join(srcDir, entry)
      const destPath = path.join(destDir, entry)

      if (shouldIgnore(path.relative(SOURCE_DIRECTORY, srcPath))) return

      try {
        const stat = fs.statSync(srcPath)

        if (stat.isDirectory()) {
          copyFilesRecursive(srcPath, destPath)
        } else {
          fs.copyFileSync(srcPath, destPath)
        }
      } catch (err) {
        console.warn(`Skipping due to access error: ${srcPath}`)
      }
    })
  } catch (err) {
    console.warn(`Error processing directory: ${srcDir}`, err)
  }
}

/**
 * Main execution function
 */
function main() {
  console.log(`Copying files from "${SOURCE_DIRECTORY}" to "${DESTINATION_DIRECTORY}"...`)

  if (fs.existsSync(DESTINATION_DIRECTORY)) {
    console.log(`Cleaning up existing destination folder: ${DESTINATION_DIRECTORY}`)
    fs.rmSync(DESTINATION_DIRECTORY, { recursive: true, force: true })
  }

  copyFilesRecursive(SOURCE_DIRECTORY, DESTINATION_DIRECTORY)

  console.log('File copy completed.')
}

main()