/**
File Name : park
Description : 공원 API - Service
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
2024.06.15  이유민   Modified  유효성 검사 추가
2024.06.14  이유민   Modified  추천 공원 facilities 추가
2024.06.15  이유민   Modified  페이지네이션 수정
2024.06.17  이유민   Modified  별점순 정렬 추가
2024.06.17  이유민   Modified  별점 실수형으로 변환
2024.06.17  이유민   Modified  user -> users
2024.06.18  이유민   Modified  페이지네이션 제거
2024.06.18  이유민   Modified  이름 검색 수정
2024.06.18  이유민   Modified  시/도 이름순 정렬
*/
import { ParkModel } from '../models/park.js';
import { BadRequest, NotFound } from '../utils/errors.js';

class ParkService {
    // 행정구역 조회
    static async getCity() {
        const { rows } = await ParkModel.readCity();

        if (!rows || rows.length === 0) {
            return new NotFound();
        }

        const resData = rows
            .filter(data => data.city != null)
            .sort((a, b) => {
                if (a.city < b.city) return -1;
                if (a.city > b.city) return 1;
                return 0;
            });
        return resData;
    }

    // 행정구역에 따른 시군구 조회
    static async getDistrict(city) {
        const { rows } = await ParkModel.readDistrictByCity(city);

        if (!rows || rows.length === 0) {
            return new NotFound();
        }

        const resData = rows
            .filter(data => data.district != null)
            .sort((a, b) => {
                if (a.district < b.district) return -1;
                if (a.district > b.district) return 1;
                return 0;
            });
        return resData;
    }

    // 공원 ID로 조회 - 공원 하나의 정보 조회할 때 사용
    static async getParkById(id) {
        const { rows } = await ParkModel.readParkById(id);
        if (rows.length === 0) {
            throw new NotFound();
        }
        rows.map(data => {
            data.average_review = parseFloat(data.average_review);
            data.count_review = parseInt(data.count_review);

            return data;
        });
        return rows;
    }

    // 공원 이름 검색
    /**
     * 페이지네이션 설명 주석
     * index 값이라 0부터 시작해서
     * 전체 10 페이지 -> 0부터 값 시작 -> maxPage: 9라고 표시됨
     * 또한, 첫 번째 페이지는 0페이지
     * 직관적으로 보기 위해 각각 1씩 추가함
     * page(현재 페이지)는 SQL문에서 사용되기 때문에 실제 값을 넘길 때는 -1
     */
    static async getParkByName(name) {
        const { rows } = await ParkModel.readParkByName(name);

        if (rows.length > 80) {
            throw new BadRequest();
        }

        rows.map(dt => (dt.average_review = parseFloat(dt.average_review)));

        return { data: rows };
    }

    // 추천 공원 조회
    /**
     * 페이지네이션 설명 주석
     * index 값이라 0부터 시작해서
     * 전체 10 페이지 -> 0부터 값 시작 -> maxPage: 9라고 표시됨
     * 또한, 첫 번째 페이지는 0페이지
     * 직관적으로 보기 위해 각각 1씩 추가함
     * page(현재 페이지) 실제 값을 넘길 때는 -1
     */
    static async getRecommendPark(city, district, facilities) {
        const { rows } = await ParkModel.readRecommendPark(city, district, facilities);

        rows.map(dt => (dt.average_review = parseFloat(dt.average_review)));

        return { data: rows };
    }

    // 공원 보유시설
    static async getFacilities(park_id) {
        const check = await ParkModel.checkParkById(park_id);
        if (check.rows.length === 0) {
            throw new NotFound();
        }

        const { rows } = await ParkModel.readFacilitiesByParkId(park_id);
        return rows;
    }
}

export default ParkService;
