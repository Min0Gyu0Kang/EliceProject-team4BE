/**File Name : map
Description : 지도 API - Service
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   공원 전체에 대한 지도 API 추가
2024.06.15  박수정   Modified   지도 API 분리 - routes, service, model
2024.06.18  박수정   Modified   공원 1개에 대한 지도 API 추가
*/

import MapModel from '../models/map.js';
import { validateQueryAndField } from '../utils/validations.js';

class MapService {
    // 공원 전체 조회
    static async getAllMap() {
        const { rows } = await MapModel.getAllMap();

        // 쿼리 및 각 필드에 대한 유효성 검사
        const requiredFields = ['id', 'name', 'address', 'latitude', 'longitude'];
        const validatedRows = validateQueryAndField(rows, requiredFields);

        const resData = validatedRows.map(data => {
            return {
                id: data.id,
                name: data.name,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
            };
        });

        return resData;
    }

    // 공원 1개 조회
    static async getOneMap(id) {
        const { rows } = await MapModel.getOneMap(id);

        // 쿼리 및 각 필드에 대한 유효성 검사
        const requiredFields = ['id', 'name', 'address', 'latitude', 'longitude'];
        const validatedRows = validateQueryAndField(rows, requiredFields);

        const data = validatedRows[0];
        const resData = {
            id: data.id,
            name: data.name,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
        };

        return resData;
    }
}

export default MapService;
