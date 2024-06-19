/**
File Name : parkReview
Description : 공원 리뷰 API - Model
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park-Review API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
2024.06.15  이유민   Modified  readReviewById 수정
2024.06.16  이유민   Modified  id, user_id varchar로 변경
2024.06.17  이유민   Modified  user -> users
2024.06.18  이유민   Modified  deleted_at 검사 추가
2024.06.19  이유민   Modified  평균 별점, 별점수 수정
*/
import db from '../models/psql.js';

class ParkReviewModel {
    // 리뷰 생성
    static async createReview(id, park_id, users_id, content, grade) {
        return await db.query(`
            INSERT INTO public."park_review" (id, park_id, users_id, content, grade)  
            VALUES ('${id}', ${park_id}, '${users_id}', '${content}', ${grade});
            `);
    }

    // id 이용해서 리뷰 조회
    static async readReviewById(id) {
        return await db.query(`
            SELECT content, grade FROM public."park_review" WHERE id = '${id}' AND deleted_at IS NULL;
            `);
    }

    // id 이용해서 리뷰 수정
    static async updateReviewById(id, content, grade) {
        return await db.query(`
            UPDATE public."park_review" 
            SET content = '${content}', grade = ${grade}, updated_at = NOW() 
            WHERE id='${id}' AND deleted_at IS NULL;
            `);
    }

    // id 이용해서 리뷰 삭제
    static async deleteReviewById(id) {
        return await db.query(`
            UPDATE public."park_review" SET deleted_at = NOW() 
            WHERE id = '${id}' AND deleted_at IS NULL;
            `);
    }

    // park id 이용해서 리뷰 조회
    static async readReviewByParkId(park_id) {
        return await db.query(`
                SELECT park.id, park.name
                , COALESCE(ROUND(AVG(CASE WHEN review.deleted_at IS NULL THEN review.grade ELSE NULL END), 1), 0) AS average_review
                FROM public."park" AS park  
                LEFT JOIN public."park_review" AS review  
                ON park.id = review.park_id  
                WHERE park.id = ${park_id}
                GROUP BY park.id;
                `);
    }

    // park id 이용해서 리뷰 상세 조회
    static async readReviewDetailByParkId(park_id) {
        return await db.query(`
                SELECT users.nickname, review.grade, review.content
                FROM public."park_review" AS review  
                JOIN public."users" AS users  
                ON review.users_id = users.id  
                WHERE review.park_id = ${park_id} AND review.deleted_at IS NULL;
                `);
    }
}

export { ParkReviewModel };
