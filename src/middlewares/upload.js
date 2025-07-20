// import multer from 'multer';
// import { TEMP_UPLOAD_DIR } from '../constants/paths.js';

// console.log('TEMP_UPLOAD_DIR:', TEMP_UPLOAD_DIR);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, TEMP_UPLOAD_DIR)
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   }
// })

// export const upload = multer({ storage })

import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src', 'temp');

await fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
