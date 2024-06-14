/**
File Name : validation
Description : 유효성 검사 미들웨어
Author : 박수정

History
Date        Author   Status    Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified  Dashboard에 대한 유효성 검사 미들웨어 추가
*/

import { BadRequest, NotFound } from './errors.js';

// Dashboard의 Service에서의 유효성 검사
export function validateQueryAndField(rows, requiredFields) {
    // 쿼리에 대한 유효성 검사
    if (!rows || rows.length === 0) {
        return new NotFound();
    }

    // 각 데이터 (항목의) 필드에 대한 유효성 검사
    const validatedData = rows.map(data => {
        for (const field of requiredFields) {
            if (!data[field]) {
                return new BadRequest(`${field} 필드의 데이터가 존재하지 않습니다.`);
            }
        }
        return data;
    });

    return validatedData;
}

// Dashboard의 Route에서의 유효성 검사
export function validateServiceData(datas) {
    // Service로부터 넘어온 데이터에 대한 유효성 검사

    for (const data of datas) {
        if (!data || data.length === 0) {
            throw new NotFound();
        }
    }
}
