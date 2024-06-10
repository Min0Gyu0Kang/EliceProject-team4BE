/**
File Name : dashboard
Description : 대시보드 차트 API
Author : 이유민

History
Date        Author   Status    Description
2024.06.08  이유민   Created
2024.06.08  이유민   Modified  Tinybar API 추가
2024.06.08  이유민   Modified  Linebar API 추가
2024.06.09  이유민   Modified  Tinybar API 수정
2024.06.10  이유민   Modified  Tinybar, Linebar API 수정
*/

const { Router } = require("express");
const db = require("../models/psql");

const router = Router();

// 1인당 공원 면적 대비 지역 별 녹지환경 만족도 API
/**
 * @swagger
 * paths:
 *  /api/dashboard/chart-linebar:
 *   get:
 *    summary: "linebar 차트"
 *    tags:
 *    - dashboard
 *    description: "1인당 공원 면적 대비 지역 별 녹지환경 만족도 정보 GET"
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        year:
 *         type: integer
 *         format: int32
 *         description: 연도
 *        capita:
 *         type: number
 *         format: float
 *         description: 해당 연도의 1인당 공원 면적
 *        satisfaction:
 *         type: number
 *         format: float
 *         description: 해당 연도의 녹지환경 만족도
 *        line:
 *         type: number
 *         format: float
 *         description: 첫 연도와 마지막 연도의 1인당 공원 면적
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 */
router.get("/chart-linebar", async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT a.year, AVG(a.park_area_per_capita) as capita, AVG(b.satisfaction) as satisfaction \
    FROM public."park_area_per_capita" AS a \
    LEFT JOIN public."green_space_satisfaction" AS b \
    ON a.year = b.year \
    GROUP BY a.year \
    ORDER BY a.year;'
    );

    resData = [];
    for (const data of result.rows) {
      resData.push({
        year: data.year,
        capita: Math.round(data.capita * 10) / 10,
        satisfaction:
          Math.round(data.satisfaction * 100) / 100 == 0
            ? null
            : Math.round(data.satisfaction * 100) / 100,
        line:
          data.year == 2013
            ? Math.round(data.capita * 10) / 10
            : data.year == 2022
            ? Math.round(data.capita * 10) / 10
            : null,
      });
    }

    for (const data of resData) {
      if (data.satisfaction == null) delete data.satisfaction;
      if (data.line == null) delete data.line;
    }

    res.json(resData);
  } catch (e) {
    next(e);
  }
});

// 전국 공원의 노후화 비율 API
/**
 * @swagger
 * paths:
 *  /api/dashboard/chart-tinybar:
 *   get:
 *    summary: "tinybar 차트"
 *    tags:
 *    - dashboard
 *    description: "전국 공원의 노후화 비율 정보 GET"
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        name:
 *         type: string
 *         description: 해당 데이터의 이름
 *        percentage:
 *         type: number
 *         format: float
 *         description: 해당 데이터의 비율
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 */
router.get("/chart-tinybar", async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM public."park_oldness_rate";');

    resData = [
      { name: "데이터 없음", count: 0, percentage: 0.0 },
      { name: "30년 이하\n2024.06.08 기준", count: 0, percentage: 0.0 },
      { name: "31년 이상", count: 0, percentage: 0.0 },
      { name: "", count: 0, percentage: 0.0 },
      { name: "31년이상\n2034.06.08 기준", count: 0, percentage: 0.0 },
    ];
    total = 0;

    for (const data of result.rows) {
      total++;
      if (data.is_old == "F") {
        resData[1].count++;
      } else if (data.is_old == "T") {
        resData[2].count++;
      } else {
        resData[0].count++;
      }
      if (data.will_be_old_in_10_years == "T") resData[4].count++;
    }

    for (const dt of resData) {
      dt.percentage = parseFloat(((dt.count / total) * 100).toFixed(2));
      delete dt.count;
    }

    res.json(resData);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
