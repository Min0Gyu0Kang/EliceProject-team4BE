/**
File Name : validation
Description : 유효성 검사 미들웨어
Author : 박수정

History
Date        Author   Status    Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified  유효성 검사 미들웨어 추가
2024.06.18  박수정   Modified  Route에서의 유효성 검사 수정
*/

import { BadRequest, NotFound } from './errors.js';

// Service에서의 유효성 검사
export function validateQueryAndField(rows, requiredFields) {
    // 쿼리에 대한 유효성 검사
    if (!rows || rows.length === 0) {
        throw new NotFound();
    }

    // 각 필드에 대한 유효성 검사
    const validatedData = rows.map(data => {
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new BadRequest(`${field} 필드의 데이터가 존재하지 않습니다.`);
            }
        }
        return data;
    });

    return validatedData;
}

// Route에서의 유효성 검사
export function validateServiceData(datas) {
    // data가 여러 개인 경우
    if (Array.isArray(datas)) {
        for (const data of datas) {
            if (!data || data.length === 0) {
                throw new NotFound();
            }
        }
    }

    // data가 1개인 경우
    if (!datas || datas.length === 0) {
        throw new NotFound();
    }
}
