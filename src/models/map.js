/**File Name : map
Description : 지도 API - Model
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   공원 전체에 대한 지도 API 추가
2024.06.15  박수정   Modified   지도 API 분리 - routes, service, model
2024.06.18  박수정   Modified   공원 1개에 대한 지도 API 추가
*/

import db from '../models/psql.js';

class MapModel {
    // 공원 전체 조회
    static async getAllMap() {
        return await db.query(`
                SELECT p.id, p.name, pr.address, pr.latitude, pr.longitude
                FROM park p
                JOIN park_region pr
                    ON p.park_region_id = pr.id
            `);
    }

    // 공원 1개 조회
    static async getOneMap(id) {
        return await db.query(`
            SELECT p.id, p.name, pr.address, pr.latitude, pr.longitude
            FROM park p
            JOIN park_region pr
                ON p.park_region_id = pr.id
            WHERE p.id = ${id}
        `);
    }
}

export default MapModel;
