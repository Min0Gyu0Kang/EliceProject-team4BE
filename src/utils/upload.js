/**
File Name : upload
Description : 파일 업로드 미들웨어
Author : 이유민

History
Date        Author   Status    Description
2024.06.18  이유민   Created
2024.06.18  이유민   Modified  단일 이미지 업로드 추가
*/
import multer from 'multer';
import path from 'path';
import { customAlphabet } from 'nanoid';
import { BadRequest } from './errors.js';

const boardImageName = customAlphabet('0123456789ABCDEFG', 20);

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'src/uploads/gallery'); // 파일을 업로드할 경로 설정
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname); // 파일 "확장자"를 추출
        cb(null, boardImageName() + ext); // nanoid로 파일명 생성 + 기존 확장자 유지
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Invalid file type');
        error.code = 'INVALID_FILE_TYPE';
        return cb(error, false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter,
});

const uploadSingleFile = () => (req, res, next) => {
    const uploadSingle = upload.single('file');
    uploadSingle(req, res, err => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                throw new BadRequest();
            }
            if (err.code === 'INVALID_FILE_TYPE') {
                throw new BadRequest();
            }
            return res.status(500).json({ message: '서버 내부에서 에러가 발생했습니다.' });
        }
        if (!req.file) {
            return next(new BadRequest());
        }
        next();
    });
};

export default uploadSingleFile;
