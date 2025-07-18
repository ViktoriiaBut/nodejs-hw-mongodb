import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/paths.js';

console.log('TEMP_UPLOAD_DIR:', TEMP_UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
})

export const upload = multer({ storage })
