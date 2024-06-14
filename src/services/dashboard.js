/**
File Name : dashboard
Description : 대시보드 차트 API - Service
Author : 박수정

History
Date        Author   Status    Description
2024.06.14  박수정   Created
2024.06.14  이유민   Modified  Linebar, Tinybar 추가
*/
const { dashboardModel } = require('../models/dashboard');

class dashboardService {
    static async getLinebar() {
        const { rows } = await dashboardModel.readLinebar();

        const resData = rows.map(data => {
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

    static async getTinybar() {
        function percentageCalc(data, filterValue, standard) {
            let res =
                data.filter(dt =>
                    standard == 2034 ? dt.will_be_old_in_10_years == filterValue : dt.is_old == filterValue,
                ).length / data.length;
            return parseFloat((res * 100).toFixed(2));
        }

        const { rows } = await dashboardModel.readTinybar();

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

module.exports = { dashboardService };
