/**
File Name : dashboard
Description : 대시보드 차트 API - Route
Author : 이유민

History
Date        Author   Status    Description
2024.06.08  이유민   Created
2024.06.08  이유민   Modified  Tinybar API 추가
2024.06.08  이유민   Modified  Linebar API 추가
2024.06.09  이유민   Modified  Tinybar API 수정
2024.06.11  박수정   Modified  Scatter API 추가
2024.06.12  박수정   Modified  Scatter API 수정
2024.06.12  이유민   Modified  Tinybar, Linebar API 수정
2024.06.13  박수정   Modified  API 문서 자동화 기능 추가
2024.06.13  이유민   Modified  Tinybar API 수정
2024.06.14  박수정   Modified  CommonJS 모듈에서 ES6 모듈로 변경
2024.06.14  박수정   Modified  Scatter API 분리 - routes, service, model
2024.06.14  이유민   Modified  Linebar, Tinybar 추가
2024.06.14  이유민   Modified  ES6 모듈로 변경
2024.06.14  이유민   Modified  대시보드 병합
2024.06.15  박수정   Modified  전체적인 코드 통일 및 유효성 검사 코드 분리
2024.06.18  박수정   Modified  Promise.all로 코드 변경
*/
import { Router } from 'express';
import DashboardService from '../services/dashboard.js';
import { validateServiceData } from '../utils/validations.js';

const router = Router();

/**
 * @swagger
 * paths:
 *   /dashboard:
 *     get:
 *       summary: '대시보드 차트 API 데이터 조회'
 *       tags:
 *         - dashboard
 *       description: 'Linebar, Tinybar, Scatter 차트 데이터 조회'
 *       responses:
 *         200:
 *           description: 차트 데이터 조회 성공
 *           schema:
 *             type: object
 *             properties:
 *               linebar:
 *                 type: array
 *                 items:
 *                   properties:
 *                     year:
 *                       type: integer
 *                       format: int32
 *                       description: 연도
 *                     capita:
 *                       type: number
 *                       format: float
 *                       description: 해당 연도의 1인당 공원 면적
 *                     satisfaction:
 *                       type: number
 *                       format: float
 *                       description: 해당 연도의 녹지환경 만족도
 *                     line:
 *                       type: number
 *                       format: float
 *                       description: 첫 연도와 마지막 연도의 1인당 공원 면적
 *               tinybar:
 *                 type: array
 *                 items:
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: 해당 데이터의 이름
 *                     percentage:
 *                       type: number
 *                       format: float
 *                       description: 해당 데이터의 비율
 *                     date:
 *                       type: string
 *                       description: 기준 날짜
 *               scatter:
 *                 type: array
 *                 items:
 *                   properties:
 *                     city:
 *                       type: string
 *                       description: 시도
 *                     park_area_per_thousand:
 *                       type: number
 *                       format: float
 *                       description: 2022년 천 명당 공원 면적
 *                     satisfaction:
 *                       type: number
 *                       format: float
 *                       description: 2022년 지역 별 녹지환경 만족도
 *         400:
 *           description: 잘못된 요청
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                  type: string
 *                  example: '데이터가 존재하지 않습니다.'
 *         404:
 *           description: 요청한 리소스를 찾을 수 없음
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                  type: string
 *                  example: '요청한 리소스를 찾을 수 없습니다.'
 *         500:
 *           description: 서버 내부 오류
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                  type: string
 *                  example: '서버 내부 에러가 발생했습니다.'
 */
router.get('/', async (req, res, next) => {
    try {
        // 3개의 차트 동시에 조회
        const [linebar, tinybar, scatter] = await Promise.all([
            DashboardService.getLinebar(),
            DashboardService.getTinybar(),
            DashboardService.getScatter(),
        ]);

        // Service로부터 넘어온 데이터에 대한 유효성 검사
        validateServiceData([linebar, tinybar, scatter]);

        res.json({ linebar, tinybar, scatter });
    } catch (e) {
        next(e);
    }
});

export default router;
