/**File Name : map
Description : 지도 API - Model
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   지도 API 분리 - routes, service, model
*/

import db from '../models/psql.js';

class MapModel {
    static async getMap() {
        return await db.query(`
                SELECT p.name, pr.address, pr.latitude, pr.longitude
                FROM park p
                JOIN park_region pr
                    ON p.park_region_id = pr.id
            `);
    }
}

export default MapModel;
