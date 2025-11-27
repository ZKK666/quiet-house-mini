#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BINARY_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.bmp', '.tif', '.tiff',
  '.mp3', '.wav', '.mp4', '.mov', '.avi', '.mkv', '.pdf', '.zip', '.gz', '.tgz', '.7z', '.rar', '.tar',
  '.ttf', '.otf', '.woff', '.woff2', '.eot', '.exe', '.dll', '.so', '.dylib'
]);

function getTrackedFiles() {
  const out = execSync('git ls-files', { encoding: 'utf8' }).trim();
  return out ? out.split('\n').filter(Boolean) : [];
}

function looksBinary(buffer) {
  const len = Math.min(buffer.length, 4096);
  if (len === 0) return false;
  let nonPrintable = 0;
  for (let i = 0; i < len; i++) {
    const byte = buffer[i];
    if (byte === 0) return true;
    if (byte < 7 || (byte > 13 && byte < 32)) {
      nonPrintable++;
    }
  }
  return nonPrintable / len > 0.3;
}

function main() {
  const files = getTrackedFiles();
  const offenders = [];

  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (BINARY_EXTS.has(ext)) {
      offenders.push({ file, reason: `扩展名 ${ext}` });
      return;
    }

    const stat = fs.statSync(file);
    if (stat.isDirectory() || stat.size === 0) return;

    const buf = fs.readFileSync(file);
    if (looksBinary(buf)) {
      offenders.push({ file, reason: '内容检测为二进制' });
    }
  });

  if (offenders.length) {
    console.error('检测到可能的二进制文件，已阻止推送：');
    offenders.forEach((item) => {
      console.error(`- ${item.file} (${item.reason})`);
    });
    console.error('\n如需保留，请改为在线资源或将文件转换为文本格式。');
    process.exit(1);
  }

  console.log('未发现二进制文件，可安全推送。');
}

main();
