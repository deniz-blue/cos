#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const androidDir = path.join(projectRoot, 'android');
const localPropertiesPath = path.join(androidDir, 'local.properties');

function pathExists(directoryPath) {
  try {
    return fs.existsSync(directoryPath);
  } catch {
    return false;
  }
}

function getCandidateSdkPaths() {
  const homeDirectory = os.homedir();

  switch (process.platform) {
    case 'darwin':
      return [path.join(homeDirectory, 'Library', 'Android', 'sdk')];
    case 'win32':
      return [path.join(homeDirectory, 'AppData', 'Local', 'Android', 'Sdk')];
    default:
      return [
        path.join(homeDirectory, 'Android', 'Sdk'),
        path.join(homeDirectory, 'Android', 'sdk'),
        '/opt/android-sdk',
        '/usr/lib/android-sdk',
      ];
  }
}

function resolveSdkPath() {
  const envCandidates = [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT].filter(Boolean);
  const candidates = [...envCandidates, ...getCandidateSdkPaths()];

  for (const candidate of candidates) {
    if (candidate && pathExists(candidate)) {
      return candidate;
    }
  }

  return null;
}

const sdkPath = resolveSdkPath();

if (!sdkPath) {
  console.error('Unable to resolve an Android SDK path. Set ANDROID_HOME or ANDROID_SDK_ROOT before building.');
  process.exit(1);
}

fs.mkdirSync(androidDir, { recursive: true });
fs.writeFileSync(localPropertiesPath, `sdk.dir=${sdkPath.replace(/\\/g, '\\\\')}\n`, 'utf8');
