/**
File Name : dashboard
Description : 대시보드 차트 API - Service
Author : 박수정

History
Date        Author   Status    Description
2024.06.14  박수정   Created
2024.06.14  박수정   Modified  CommonJS 모듈에서 ES6 모듈로 변경
2024.06.14  박수정   Modified  Scatter API 분리 - routes, service, model
2024.06.14  이유민   Modified  Linebar, Tinybar 추가
2024.06.14  이유민   Modified  ES6 모듈로 변경
*/

import { DashboardModel } from '../models/dashboard.js';
import { BadRequest, NotFound } from '../utils/errors.js';

// Scatter 차트 데이터

// 클래스 기반 코드
class DashboardService {
    async getScatter() {
        const rows = await DashboardModel.getScatter();

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

    async getLinebar() {
        const { rows } = await DashboardModel.getLinebar();

        // 쿼리에 대한 유효성 검사
        if (!rows || rows.length === 0) {
            return new NotFound();
        }

        const resData = rows.map(data => {
            // 각 데이터에 대한 유효성 검사
            if (!data.city || !data.year || !data.capita) {
                return new BadRequest('데이터가 존재하지 않습니다.');
            }

            const item = {
                year: data.year,
                capita: Math.round(data.capita * 10) / 10,
            };

            // 녹지환경 만족도 있는 연도에만 만족도 추가
            if (data.year % 2 == 0) {
                item.satisfaction = Math.round(data.satisfaction * 100) / 100;
            }

            // 첫 연도와 마지막 연도에만 line 추가
            if (data.year === 2010 || data.year === 2022) {
                item.line = Math.round(data.capita * 10) / 10;
            }

            return item;
        });

        return resData;
    }

    async getTinybar() {
        function percentageCalc(data, filterValue, standard) {
            let res =
                data.filter(dt =>
                    standard == 2034 ? dt.will_be_old_in_10_years == filterValue : dt.is_old == filterValue,
                ).length / data.length;
            return parseFloat((res * 100).toFixed(2));
        }

        const { rows } = await DashboardModel.getTinybar();

        // 쿼리에 대한 유효성 검사
        if (!rows || rows.length === 0) {
            return new NotFound();
        }

        const resData = [
            { name: '데이터 없음', percentage: percentageCalc(rows, 'N') },
            {
                name: '30년 이하',
                percentage: percentageCalc(rows, 'F'),
            },
            {
                name: '31년 이상',
                percentage: percentageCalc(rows, 'T'),
                date: '2024-06-08',
            },
            { name: '', percentage: 0.0 },
            {
                name: '31년 이상',
                percentage: percentageCalc(rows, 'T', 2034),
                date: '2034-06-08',
            },
        ];

        return resData;
    }
}

const serviceInstance = new DashboardService(); // 싱글톤 인스턴스 생성
export default serviceInstance;
