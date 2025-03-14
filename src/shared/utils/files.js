/* eslint-disable import/prefer-default-export */
import * as fflate from 'fflate';

const fileToU8 = (file, cb) => {
  const fr = new FileReader();
  fr.onloadend = () => {
    cb(new Uint8Array(fr.result));
  };
  fr.readAsArrayBuffer(file);
};

const download = (file, name) => {
  const url = URL.createObjectURL(new Blob([file]));
  const dl = document.createElement('a');
  dl.download = name || (`compressed-file-${Date.now()}.zip`);
  dl.href = url;
  dl.click();
  URL.revokeObjectURL(url);
};

/**
 * Compress list of files
 * @param {Array} files list of files
 * @param {String} fileName file name
 * @param {Function} finish finish callback
 */
export const compressFiles = (files, fileName, finish) => {
  // fflate's ZIP API is asynchronous and parallelized (multithreaded)
  let left = files.length;
  const zipObj = {};
  const ALREADY_COMPRESSED = [
    'zip', 'gz', 'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx',
    'xls', 'xlsx', 'heic', 'heif', '7z', 'bz2', 'rar', 'gif', 'webp', 'webm',
    'mp4', 'mov', 'mp3', 'aifc',
  ];

  // Yet again, this is necessary for parallelization.
  const processFile = (i) => {
    const file = files[i];
    const ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
    fileToU8(file, (buf) => {
      // With fflate, we can choose which files we want to compress
      zipObj[file.name] = [buf, {
        level: ALREADY_COMPRESSED.indexOf(ext) === -1 ? 6 : 0,
      }];

      // If we didn't want to specify options:
      // zipObj[file.name] = buf;

      // eslint-disable-next-line no-plusplus
      if (!--left) {
        fflate.zip(zipObj, {
          // If you want to control options for every file, you can do so here
          // They are merged with the per-file options (if they exist)
          // mem: 9
        }, (err, out) => {
          download(out, fileName);
          finish();
        });
      }
    });
  };
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < files.length; ++i) {
    processFile(i);
  }
};

export const getExtensionFromMime = (mimeType) => {
  const mimeMap = {
    'application/zip': 'zip',
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'text/plain': 'txt',
  };
  return mimeMap[mimeType] || 'zip';
};
