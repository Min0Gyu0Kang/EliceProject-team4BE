/**File Name : sendTempPasswordByEmail
Description : 이메일로 임시 비밀번호 전송
Author : 박수정

History
Date        Author   Status     Description
2024.06.16  박수정   Created
2024.06.16  박수정   Modified   이메일 전송 미들웨어 추가
2024.06.19  박수정   Modified   이메일 전송 미들웨어 수정
*/
import nodemailer from 'nodemailer';

// 이메일 전송 객체 생성
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PWD,
    },
});

async function sendTempPasswordByEmail(mailOptions) {
    try {
        await transporter.sendMail(mailOptions);
        console.log('이메일 전송 완료');
    } catch (e) {
        console.log('이메일 전송 실패');
        next(e);
    }
}

export default sendTempPasswordByEmail;
