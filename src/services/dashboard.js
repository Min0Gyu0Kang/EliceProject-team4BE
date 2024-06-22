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
2024.06.15  박수정   Modified  전체적인 코드 통일 및 유효성 검사 코드 분리
2024.06.15  이유민   Modified  코드 통일
*/

import DashboardModel from '../models/dashboard.js';
import { validateQueryAndField } from '../utils/validations.js';

class DashboardService {
    // Linebar
    static async getLinebar() {
        const { rows } = await DashboardModel.getLinebar();

        // 쿼리 및 각 필드에 대한 유효성 검사
        const requiredFields = ['year', 'capita'];
        const validatedRows = validateQueryAndField(rows, requiredFields);

        const resData = validatedRows.map(data => {
            const item = {
                year: data.year,
                capita: Math.round(data.capita * 10) / 10,
            };

            // 녹지환경 만족도 있는 연도에만 만족도 추가
            if (data.year % 2 === 0) {
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

    // Tinybar
    static async getTinybar() {
        const { rows } = await DashboardModel.getTinybar();

        // 쿼리 및 각 필드에 대한 유효성 검사
        const requiredFields = ['will_be_old_in_10_years', 'is_old'];
        const validatedRows = validateQueryAndField(rows, requiredFields);

        function percentageCalc(data, filterValue, standard) {
            let res =
                data.filter(dt =>
                    standard === 2034 ? dt.will_be_old_in_10_years === filterValue : dt.is_old === filterValue,
                ).length / data.length;
            return parseFloat((res * 100).toFixed(2));
        }

        const resData = [
            {
                name: '데이터 없음',
                percentage: percentageCalc(validatedRows, 'N'),
            },
            {
                name: '30년 이하',
                percentage: percentageCalc(validatedRows, 'F'),
            },
            {
                name: '31년 이상',
                percentage: percentageCalc(validatedRows, 'T'),
                date: '2024-06-08',
            },
            {
                name: '',
                percentage: 0.0,
            },
            {
                name: '31년 이상',
                percentage: percentageCalc(validatedRows, 'T', 2034),
                date: '2034-06-08',
            },
        ];

        return resData;
    }

    // Scatter
    static async getScatter() {
        const { rows } = await DashboardModel.getScatter();

        // 쿼리 및 각 필드에 대한 유효성 검사
        const requiredFields = ['city', 'park_area_per_thousand', 'satisfaction'];
        const validatedRows = validateQueryAndField(rows, requiredFields);

        const resData = validatedRows.map(data => {
            return {
                city: data.city,
                park_area_per_thousand: data.park_area_per_thousand,
                satisfaction: data.satisfaction,
            };
        });

        return resData;
    }
}

export default DashboardService;
