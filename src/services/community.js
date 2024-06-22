/**
File Name : community
Description : 커뮤니티 API - Service
Author : 이유민

History
Date        Author   Status    Description
2024.06.16  이유민   Created
2024.06.16  이유민   Modified  생성, 조회 추가
2024.06.17  이유민   Modified  user -> users
2024.06.18  이유민   Modified  유효성 검사 수정
2024.06.19  이유민   Modified  접근 권한 추가
*/
import { CommunityModel } from '../models/community.js';
import { ParkModel } from '../models/park.js';
import { Forbidden, NotFound } from '../utils/errors.js';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFG', 8);

class CommunityService {
    // 게시글 생성
    static async addPost(park_id, users_id, title, content) {
        const data = await ParkModel.checkParkById(park_id);
        if (data.rows.length === 0) {
            throw new NotFound();
        }

        const { rows } = await CommunityModel.createBoard(nanoid(), park_id, users_id, title, content);
        return rows;
    }

    // 게시글 수정
    static async updatePost(id, users_id, title, content) {
        const check = await CommunityModel.readBoardById(id);
        if (check.rows.length === 0) {
            throw new NotFound();
        }
        if (check.rows[0].id !== users_id) {
            throw new Forbidden();
        }

        const { rows } = await CommunityModel.updateBoard(id, users_id, title, content);
        return rows;
    }

    // 게시글 삭제
    static async deletePost(id, users_id) {
        const check = await CommunityModel.readBoardById(id);
        if (check.rows.length === 0) {
            throw new NotFound();
        }
        if (check.rows[0].id !== users_id) {
            throw new Forbidden();
        }

        const { rows } = await CommunityModel.deleteBoard(id, users_id);
        return rows;
    }

    // 게시글 전체 조회
    static async getPostAll() {
        const { rows } = await CommunityModel.readBoardAll();
        return rows;
    }

    // 게시글 조회
    static async getPostById(id) {
        const { rows } = await CommunityModel.readBoardById(id);

        if (rows.length === 0) {
            throw new NotFound();
        }

        return rows;
    }

    // 갤러리 생성
    static async addGallery(park_id, users_id, image, tags) {
        const { rows } = await CommunityModel.createGallery(nanoid(), park_id, users_id, image, tags);
        return rows;
    }

    // 갤러리 수정
    static async updateGallery(id, users_id, image, tags) {
        const check = await CommunityModel.checkGalleryById(id);
        if (check.rows.length === 0) {
            throw new NotFound();
        }
        if (check.rows[0].users_id !== users_id) {
            throw new Forbidden();
        }

        const { rows } = await CommunityModel.updateGalleryById(id, users_id, image, tags);
        return rows;
    }

    // 갤러리 삭제
    static async deleteGallery(id, users_id) {
        const check = await CommunityModel.checkGalleryById(id);
        if (check.rows.length === 0) {
            throw new NotFound();
        }
        if (check.rows[0].users_id !== users_id) {
            throw new Forbidden();
        }

        const { rows } = await CommunityModel.deleteGallery(id, users_id);
        return rows;
    }

    // 갤러리 전체 조회
    static async getGalleryAll() {
        const { rows } = await CommunityModel.readGalleryAll();
        return rows;
    }

    // 갤러리 조회
    static async getGalleryById(id) {
        const { rows } = await CommunityModel.readGalleryById(id);

        if (rows.length === 0) {
            throw new NotFound();
        }

        return rows;
    }

    // 민원 넣기
    static async getManagementByName(name) {
        const { rows } = await CommunityModel.readManagementByName(name);

        if (rows.length === 0) {
            throw new NotFound();
        }

        return rows;
    }
}

export default CommunityService;
