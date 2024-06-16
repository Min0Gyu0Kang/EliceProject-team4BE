/**
File Name : community
Description : 커뮤니티 API - Service
Author : 이유민

History
Date        Author   Status    Description
2024.06.16  이유민   Created
2024.06.16  이유민   Modified  생성, 조회 추가
*/
import { CommunityModel } from '../models/community.js';
import { customAlphabet } from 'nanoid';
import { BadRequest, NotFound } from '../utils/errors.js';

const nanoid = customAlphabet('0123456789ABCDEFG', 8);

class CommunityService {
    // 게시글 생성
    static async addPost(park_id, user_id, title, content) {
        if (!park_id || !user_id || !title || !content) {
            throw new BadRequest();
        }
        const { rows } = await CommunityModel.createPost(nanoid(), park_id, user_id, title, content);
        return rows;
    }

    // 게시글 전체 조회
    static async getPostAll() {
        const { rows } = await CommunityModel.readPostAll();
        return rows;
    }

    // 게시글 조회
    static async getPostById(id) {
        const { rows } = await CommunityModel.readPostById(id);

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
