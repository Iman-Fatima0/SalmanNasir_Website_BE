// Diagnostic script to investigate EPERM rename error
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, '.cursor', 'debug.log');
const serverEndpoint = 'http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f';

function log(message, data = {}) {
  const logEntry = {
    location: 'diagnose_rename_issue.js',
    message,
    data,
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'diagnosis',
    hypothesisId: 'A'
  };
  
  // Write to log file
  try {
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  } catch (e) {
    console.error('Failed to write log file:', e.message);
  }
  
  // Send to server
  fetch(serverEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logEntry)
  }).catch(() => {});
}

// #region agent log
log('Starting directory rename diagnosis', {
  workspaceRoot: __dirname,
  srcPath: path.join(__dirname, 'src'),
  nestedPath: path.join(__dirname, 'Elcandi_Website_BE', 'src')
});
// #endregion

// Hypothesis A: Directory is locked by another process
try {
  // #region agent log
  log('Checking if src directory exists and is accessible', {
    srcExists: fs.existsSync(path.join(__dirname, 'src')),
    srcIsDirectory: fs.existsSync(path.join(__dirname, 'src')) ? fs.statSync(path.join(__dirname, 'src')).isDirectory() : false
  });
  // #endregion
  
  // Try to read directory
  const srcPath = path.join(__dirname, 'src');
  if (fs.existsSync(srcPath)) {
    // #region agent log
    log('Attempting to read src directory contents', {
      canRead: true
    });
    // #endregion
    
    const files = fs.readdirSync(srcPath);
    // #region agent log
    log('Successfully read src directory', {
      fileCount: files.length,
      files: files.slice(0, 10) // First 10 files
    });
    // #endregion
  }
} catch (error) {
  // #region agent log
  log('Error accessing src directory', {
    error: error.message,
    code: error.code
  });
  // #endregion
}

// Hypothesis B: Nested directory structure causing path issues
try {
  const nestedPath = path.join(__dirname, 'Elcandi_Website_BE');
  // #region agent log
  log('Checking nested directory structure', {
    nestedExists: fs.existsSync(nestedPath),
    nestedIsDirectory: fs.existsSync(nestedPath) ? fs.statSync(nestedPath).isDirectory() : false
  });
  // #endregion
  
  if (fs.existsSync(nestedPath)) {
    const nestedContents = fs.readdirSync(nestedPath);
    // #region agent log
    log('Nested directory contents', {
      items: nestedContents
    });
    // #endregion
  }
} catch (error) {
  // #region agent log
  log('Error checking nested directory', {
    error: error.message
  });
  // #endregion
}

// Hypothesis C: File handles open in src directory
try {
  // Check if any files in src are being accessed
  const srcPath = path.join(__dirname, 'src');
  if (fs.existsSync(srcPath)) {
    // Try to create a test file to check write access
    const testFile = path.join(srcPath, '.test_write_access');
    try {
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      // #region agent log
      log('Write access test successful', {
        canWrite: true
      });
      // #endregion
    } catch (error) {
      // #region agent log
      log('Write access test failed', {
        error: error.message,
        code: error.code
      });
      // #endregion
    }
  }
} catch (error) {
  // #region agent log
  log('Error testing file access', {
    error: error.message
  });
  // #endregion
}

// Hypothesis D: Permission issues
try {
  const srcPath = path.join(__dirname, 'src');
  if (fs.existsSync(srcPath)) {
    const stats = fs.statSync(srcPath);
    // #region agent log
    log('Directory permissions check', {
      mode: stats.mode.toString(8),
      uid: stats.uid,
      gid: stats.gid
    });
    // #endregion
  }
} catch (error) {
  // #region agent log
  log('Error checking permissions', {
    error: error.message
  });
  // #endregion
}

// Hypothesis E: Destination path issue (malformed path)
try {
  const destPath = path.join(__dirname, 'Elcandi_Website_BE', 'src');
  // #region agent log
  log('Checking destination path', {
    destPath,
    destExists: fs.existsSync(destPath),
    parentExists: fs.existsSync(path.dirname(destPath))
  });
  // #endregion
  
  // Check if destination already exists
  if (fs.existsSync(destPath)) {
    // #region agent log
    log('Destination already exists', {
      isDirectory: fs.statSync(destPath).isDirectory(),
      isEmpty: fs.readdirSync(destPath).length === 0
    });
    // #endregion
  }
} catch (error) {
  // #region agent log
  log('Error checking destination', {
    error: error.message
  });
  // #endregion
}

// #region agent log
log('Diagnosis complete', {
  summary: 'All hypotheses tested'
});
// #endregion

console.log('Diagnosis complete. Check .cursor/debug.log for details.');

