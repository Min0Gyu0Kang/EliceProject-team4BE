/**
File Name : parkReview
Description : 공원 리뷰 API - Service
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park-Review API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
2024.06.15  이유민   Modified  리뷰 조회 추가
2024.06.15  이유민   Modified  유효성 검사 추가
2024.06.16  이유민   Modified  id, user_id varchar로 변경
2024.06.17  이유민   Modified  user -> users
2024.06.18  이유민   Modified  유효성 검사 추가
*/
import { ParkModel } from '../models/park.js';
import { ParkReviewModel } from '../models/parkReview.js';
import { BadRequest, NotFound } from '../utils/errors.js';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFG', 8);

class ParkReviewService {
    // 리뷰 생성
    static async addReview(park_id, users_id, content, grade) {
        // 유효성 검사
        if (!content || !grade) {
            throw new BadRequest();
        }
        if (content.length > 400) {
            throw new BadRequest();
        }
        if (content.includes("'")) {
            content = content.replaceAll("'", "''");
        }
        if (grade < 0 || grade > 5) {
            throw new BadRequest();
        }

        const { rows } = await ParkModel.checkParkById(park_id);
        if (rows.length === 0) {
            throw new NotFound();
        }

        return await ParkReviewModel.createReview(nanoid(), park_id, users_id, content, grade);
    }

    // 리뷰 수정
    static async updateReview(id, content, grade) {
        // 유효성 검사
        if (!content || !grade) {
            throw new BadRequest();
        }
        if (content.length > 400) {
            throw new BadRequest();
        }
        if (content.includes("'")) {
            content = content.replaceAll("'", "''");
        }
        if (grade < 0 || grade > 5) {
            throw new BadRequest();
        }

        const { rows } = await ParkReviewModel.readReviewById(id);
        if (rows.length === 0) {
            throw new NotFound();
        }

        return await ParkReviewModel.updateReviewById(id, content, grade);
    }

    // 리뷰 삭제
    static async deleteReview(id) {
        const { rows } = await ParkReviewModel.readReviewById(id);
        if (rows.length === 0) {
            throw new NotFound();
        }

        return await ParkReviewModel.deleteReviewById(id);
    }

    // 리뷰 조회
    static async getReviewById(id) {
        const { rows } = await ParkReviewModel.readReviewById(id);
        if (rows.length === 0) {
            throw new NotFound();
        }

        return rows;
    }

    // 리뷰 상세보기 - 공원명, 공원 평균 점수
    static async getReview(park_id) {
        const check = await ParkModel.checkParkById(park_id);
        if (check.rows.length === 0) {
            throw new NotFound();
        }

        const { rows } = await ParkReviewModel.readReviewByParkId(park_id);
        rows.map(data => (data.average_review = parseFloat(data.average_review)));
        return rows;
    }

    // 리뷰 상세보기 - 리뷰 작성자, 별점, 내용
    static async getReviewDetail(park_id) {
        const check = await ParkModel.checkParkById(park_id);
        if (check.rows.length === 0) {
            throw new NotFound();
        }

        const { rows } = await ParkReviewModel.readReviewDetailByParkId(park_id);
        return rows;
    }
}

export default ParkReviewService;
