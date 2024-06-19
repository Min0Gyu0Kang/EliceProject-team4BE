/**
File Name : park
Description : 공원 API - Model
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
2024.06.14  이유민   Modified  주석 추가
2024.06.14  이유민   Modified  deleted_at 확인 코드 추가
2024.06.14  이유민   Modified  추천 공원 facilities 추가
2024.06.16  이유민   Modified  추천 공원 수정
2024.06.17  이유민   Modified  별점순 정렬 추가
2024.06.17  이유민   Modified  별점 기본 값 추가
2024.06.17  이유민   Modified  user -> users
2024.06.18  이유민   Modified  페이지네이션 제거
2024.06.19  이유민   Modified  평균 별점, 별점수 수정
*/
import db from '../models/psql.js';

class ParkModel {
    // 공원의 ID가 존재하는지 확인
    static async checkParkById(id) {
        return await db.query(`
            SELECT id FROM public."park" WHERE id = ${id} AND deleted_at IS NULL;
            `);
    }

    // 행정구역 조회
    static async readCity() {
        return await db.query(`
              SELECT DISTINCT city  
              FROM public."park_legal_region"  
              ORDER BY city ASC;
            `);
    }

    // 행정구역에 따른 시군구 조회
    static async readDistrictByCity(city) {
        return await db.query(`
              SELECT DISTINCT district  
              FROM public."park_legal_region"  
              WHERE city ='${city}'  
              ORDER BY district ASC;
            `);
    }

    // 이름으로 정보 조회 - 공원 검색
    static async readParkByName(name) {
        const query = `
                SELECT park.id, park.name, region.address
                , region.latitude, region.longitude
                , COALESCE(ROUND(AVG(CASE WHEN review.deleted_at IS NULL THEN review.grade ELSE NULL END), 1), 0) AS average_review
                FROM public."park" AS park  
                JOIN public."park_region" AS region  
                ON park.park_region_id = region.id  
                LEFT JOIN public."park_review" AS review  
                ON park.id = review.park_id  
                WHERE name LIKE '%${name}%' AND park.deleted_at IS NULL
                GROUP BY park.id, region.address, region.latitude, region.longitude   
                ORDER BY average_review DESC, park.id ASC;
                `;
        const data = await db.query(query);

        return data;
    }

    // 공원 id로 정보 조회
    static async readParkById(id) {
        return await db.query(`
                SELECT park.id, park.name, park.type, region.address, government.phone_number
                , COALESCE(ROUND(AVG(CASE WHEN review.deleted_at IS NULL THEN review.grade ELSE NULL END), 1), 0) AS average_review
                , COALESCE(COUNT(CASE WHEN review.deleted_at IS NULL THEN review.grade ELSE NULL END), 0) AS count_review
                FROM public."park" AS park  
                JOIN public."park_region" AS region  
                ON park.park_region_id = region.id  
                JOIN public."local_government" AS government  
                ON park.local_government_id = government.id  
                LEFT JOIN public."park_review" AS review  
                ON park.id = review.park_id  
                WHERE park.id = ${id} AND park.deleted_at IS NULL
                GROUP BY park.id, region.address, government.phone_number;
                `);
    }

    // 위치에 따른 정보 조회 - 추천 공원
    static async readRecommendPark(city, district, facilities) {
        // 세종특별자치시는 시군구가 따로 없기 때문에 조건문 이용해서 Query 완성
        let whereQuery = `WHERE legal_region.city = '${city}'`;
        if (district && city != '세종특별자치시') {
            whereQuery += `AND legal_region.district = '${district}'`;
        }

        let havingQuery = '';
        let facilityJoinQuery = '';
        if (facilities.length > 0) {
            facilityJoinQuery = `
                LEFT JOIN public."park_facilities" as facilities
                ON park.id = facilities.park_id
                JOIN public."park_facilities_categories" as categories
                ON facilities.park_facilities_categories_id = categories.id
                JOIN public."park_facilities_categories" as parent_categories
                ON categories.parent_category_id = parent_categories.id
                `;

            havingQuery =
                `HAVING ` +
                facilities
                    .map(
                        facility =>
                            `COUNT(DISTINCT CASE WHEN parent_categories.name = '${facility}' THEN 1 ELSE NULL END) > 0`,
                    )
                    .join(' AND ');
        }

        const query = `
                SELECT park.id, park.name, region.address
                , region.latitude, region.longitude
                , COALESCE(ROUND(AVG(CASE WHEN review.deleted_at IS NULL THEN review.grade ELSE NULL END), 1), 0) AS average_review
                FROM public."park" AS park  
                JOIN public."park_region" AS region  
                ON park.park_region_id = region.id  
                JOIN public."park_legal_region" AS legal_region  
                ON region.park_legal_region_id = legal_region.id  
                LEFT JOIN public."park_review" AS review  
                ON park.id = review.park_id  
                ${facilityJoinQuery}
                ${whereQuery}  
                GROUP BY park.id, region.address, region.latitude, region.longitude
                ${havingQuery}
                ORDER BY average_review DESC, park.id ASC;
        `;

        const data = await db.query(query);

        return data;
    }

    // 공원 ID에 따른 보유시설 조회
    static async readFacilitiesByParkId(park_id) {
        return await db.query(`
                SELECT parent.name AS category, category1.name  
                FROM public."park_facilities" AS facilities  
                JOIN public."park_facilities_categories" AS category1
                ON facilities.park_facilities_categories_id = category1.id
                JOIN public."park_facilities_categories" AS parent
                ON category1.parent_category_id = parent.id
                WHERE facilities.park_id = ${park_id} AND facilities.deleted_at IS NULL;
                `);
    }
}

export { ParkModel };
