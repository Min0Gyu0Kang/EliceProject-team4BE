/**
File Name : park
Description : 공원 API - Service
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
*/
import { ParkModel } from '../models/park.js';

class ParkService {
    // 행정구역 조회
    static async getCity() {
        const { rows } = await ParkModel.readCity();
        return rows;
    }

    // 행정구역에 따른 시군구 조회
    static async getDistrict(city) {
        const { rows } = await ParkModel.readDistrictByCity(city);
        const resData = rows
            .filter(data => data.district != null)
            .sort((a, b) => {
                if (a.district < b.district) return -1;
                if (a.district > b.district) return 1;
                return 0;
            });
        return resData;
    }

    static async getParkById(id) {
        const { rows } = await ParkModel.readParkById(id);
        return rows;
    }

    // 공원 이름 검색
    static async getParkByName(name, perPage, page) {
        const { maxPage, data } = await ParkModel.readParkByName(name, perPage, page);
        return { maxPage: Math.ceil(maxPage.rows.length / perPage) - 1, page, data: data.rows };
    }

    // 추천 공원 조회
    static async getRecommendPark(city, district, perPage, page) {
        const { maxPage, data } = await ParkModel.readRecommendPark(city, district, perPage, page);

        return { maxPage: Math.ceil(maxPage.rows.length / perPage) - 1, page, data: data.rows };
    }

    // 공원 보유시설
    static async getFacilities(park_id) {
        const { rows } = await ParkModel.readFacilitiesByParkId(park_id);
        return rows;
    }
}

export default ParkService;
