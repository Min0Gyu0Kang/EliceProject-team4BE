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
2024.06.18  이유민   Modified  유효성 검사 수정
2024.06.19  이유민   Modified  접근 권한 추가
*/
import { ParkModel } from '../models/park.js';
import { ParkReviewModel } from '../models/parkReview.js';
import { NotFound, Forbidden } from '../utils/errors.js';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFG', 8);

class ParkReviewService {
    // 리뷰 생성
    static async addReview(park_id, users_id, content, grade) {
        const { rows } = await ParkModel.checkParkById(park_id);
        if (rows.length === 0) {
            throw new NotFound();
        }

        return await ParkReviewModel.createReview(nanoid(), park_id, users_id, content, grade);
    }

    // 리뷰 수정
    static async updateReview(id, users_id, content, grade) {
        const { rows } = await ParkReviewModel.readReviewById(id);
        if (rows.length === 0) {
            throw new NotFound();
        }

        const check = await ParkReviewModel.checkReviewById(id, users_id);
        if (check.length === 0) {
            throw new Forbidden();
        }

        return await ParkReviewModel.updateReviewById(id, users_id, content, grade);
    }

    // 리뷰 삭제
    static async deleteReview(id, users_id) {
        const { rows } = await ParkReviewModel.readReviewById(id);
        if (rows.length === 0) {
            throw new NotFound();
        }

        const check = await ParkReviewModel.checkReviewById(id, users_id);
        if (check.length === 0) {
            throw new Forbidden();
        }

        return await ParkReviewModel.deleteReviewById(id, users_id);
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
