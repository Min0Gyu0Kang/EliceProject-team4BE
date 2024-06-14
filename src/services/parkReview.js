/**
File Name : parkReview
Description : 공원 리뷰 API - Service
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park-Review API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
*/
import { ParkModel } from '../models/park.js';
import { ParkReviewModel } from '../models/parkReview.js';
import { BadRequest, NotFound } from '../utils/errors.js';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789', 6);

class ParkReviewService {
    // 리뷰 생성
    static async addReview(park_id, user_id, content, grade) {
        if (!content || !grade) {
            throw new BadRequest();
        }

        if (grade < 0 || grade > 5) {
            throw new BadRequest();
        }

        const { rows } = await ParkModel.checkParkById(park_id);
        if (rows.length == 0) {
            throw new NotFound();
        }

        return await ParkReviewModel.createReview(nanoid(), park_id, user_id, content, grade);
    }

    // 리뷰 수정
    static async updateReview(id, content, grade) {
        if (!content || !grade) {
            throw new BadRequest();
        }

        if (grade < 0 || grade > 5) {
            throw new BadRequest();
        }

        const { rows } = await ParkReviewModel.readReviewById(id);
        if (rows.length == 0 || rows[0].deleted_at != null) {
            throw new NotFound();
        }

        return await ParkReviewModel.updateReviewById(id, content, grade);
    }

    // 리뷰 삭제
    static async deleteReview(id) {
        const { rows } = await ParkReviewModel.readReviewById(id);
        if (rows.length == 0 || rows[0].deleted_at != null) {
            throw new NotFound();
        }

        return await ParkReviewModel.deleteReviewById(id);
    }

    // 리뷰 상세보기 - 공원명, 공원 평균 점수
    static async getReview(park_id) {
        const { rows } = await ParkReviewModel.readReviewByParkId(park_id);
        rows.map(data => (data.average_review = parseFloat(data.average_review)));
        return rows;
    }

    // 리뷰 상세보기 - 리뷰 작성자, 별점, 내용
    static async getReviewDetail(park_id) {
        const { rows } = await ParkReviewModel.readReviewDetailByParkId(park_id);
        return rows;
    }
}

const serviceInstance = new ParkReviewService(); // 싱글톤 인스턴스 생성
export default ParkReviewService;
