/**
File Name : dashboard
Description : 대시보드 차트 API - Service
Author : 박수정

History
Date        Author   Status    Description
2024.06.14  박수정   Created
2024.06.14  박수정   Modified  CommonJS 모듈에서 ES6 모듈로 변경
2024.06.14  박수정   Modified  Scatter API 분리 - routes, service, model
*/

import { getScatter } from '../models/dashboard.js';
import { BadRequest, NotFound } from '../utils/errors.js';

// Scatter 차트 데이터

// 클래스 기반 코드
class DashboardService {
    async getScatter() {
        const rows = await getScatter();

        // 쿼리에 대한 유효성 검사
        if (!rows || rows.length === 0) {
            return new NotFound();
        }

        const data = rows.map(row => {
            // 각 데이터에 대한 유효성 검사
            if (!row.city || !row.park_area_per_thousand || !row.satisfaction) {
                return new BadRequest('데이터가 존재하지 않습니다.');
            }

            return {
                city: row.city,
                park_area_per_thousand: row.park_area_per_thousand,
                satisfaction: row.satisfaction,
            };
        });

        return data;
    }
}

const serviceInstance = new DashboardService(); // 싱글톤 인스턴스 생성
export default serviceInstance;
