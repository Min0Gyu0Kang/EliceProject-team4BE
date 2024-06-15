/**File Name : map
Description : 지도 API - Service
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   지도 API 분리 - routes, service, model
*/

import MapModel from '../models/map.js';
import { validateQueryAndField } from '../utils/validations.js';

class MapService {
    static async getMap() {
        const { rows } = await MapModel.getMap();

        // 쿼리 및 각 필드에 대한 유효성 검사
        const requiredFields = ['name', 'address', 'latitude', 'longitude'];
        const validatedRows = validateQueryAndField(rows, requiredFields);

        const resData = validatedRows.map(data => {
            return {
                name: data.name,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
            };
        });

        return resData;
    }
}

export default MapService;
