/**
File Name : park
Description : 공원 API - Model
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
*/
import db from '../models/psql.js';

class ParkModel {
    static async checkParkById(id) {
        const query = `
            SELECT id FROM public."park" WHERE id = ${id};
            `;
        return await db.query(query);
    }
    static async readCity() {
        const query = `
              SELECT DISTINCT city  
              FROM public."park_legal_region"  
              ORDER BY city ASC;
            `;
        return await db.query(query);
    }
    static async readDistrictByCity(city) {
        const query = `
              SELECT DISTINCT district  
              FROM public."park_legal_region"  
              WHERE city ='${city}'  
              ORDER BY district ASC;
            `;
        return await db.query(query);
    }
    static async readParkByName(name, perPage, page) {
        return await db.query(`
                SELECT park.id, park.name, region.address, ROUND(AVG(review.grade), 1) AS average_review  
                FROM public."park" AS park  
                JOIN public."park_region" AS region  
                ON park.park_region_id = region.id  
                LEFT JOIN public."park_review" AS review  
                ON park.id = review.park_id  
                WHERE name LIKE '%${name}%'  
                GROUP BY park.id, region.address  
                LIMIT ${perPage} OFFSET ${5 * page};
                `);
    }
    static async readParkById(id) {
        const query = `
                SELECT park.id, park.name, park.type, region.address, government.phone_number, ROUND(AVG(review.grade), 1) AS average_review, COUNT(review.grade) AS count_review  
                FROM public."park" AS park  
                JOIN public."park_region" AS region  
                ON park.park_region_id = region.id  
                JOIN public."local_government" AS government  
                ON park.local_government_id = government.id  
                LEFT JOIN public."park_review" AS review  
                ON park.id = review.park_id  
                WHERE park.id = '${id}'  
                GROUP BY park.id, region.address, government.phone_number;
                `;
        return await db.query(query);
    }
    static async readRecommendPark(city, district, perPage, page) {
        // 세종특별자치시는 시군구가 따로 없기 때문에 조건문 이용해서 Query 완성
        let whereQuery = `WHERE legal_region.city = '${city}'`;
        if (city != '세종특별자치시') {
            whereQuery += `AND legal_region.district = '${district}'`;
        }
        return await db.query(`
                SELECT park.id, park.name, region.address, ROUND(AVG(review.grade), 1) AS average_review  
                FROM public."park" AS park  
                JOIN public."park_region" AS region  
                ON park.park_region_id = region.id  
                JOIN public."park_legal_region" AS legal_region  
                ON region.park_legal_region_id = legal_region.id  
                LEFT JOIN public."park_review" AS review  
                ON park.id = review.park_id  
                ${whereQuery}  
                GROUP BY park.id, region.address
                LIMIT ${perPage} OFFSET ${5 * page};
        `);
    }
    static async readFacilitiesByParkId(park_id) {
        const query = `
                SELECT facilities.park_id, parent.name AS category, category1.name  
                FROM public."park_facilities" AS facilities  
                JOIN public."park_facilities_categories" AS category1
                ON facilities.park_facilities_categories_id = category1.id
                JOIN public."park_facilities_categories" AS parent
                ON category1.parent_category_id = parent.id
                WHERE facilities.park_id = '${park_id}';
                `;
        return await db.query(query);
    }
}

export { ParkModel };
