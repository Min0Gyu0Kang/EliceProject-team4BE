/**File Name : errors
Description : 에러 처리 미들웨어
Author : 박수정

History
Date        Author   Status     Description
2024.06.13  박수정   Created
2024.06.13  박수정   Modified   에러 처리 미들웨어 추가
2024.06.13  박수정   Modified   에러 처리 미들웨어 완료
2024.06.14  박수정   Modified   CommonJS 모듈에서 ES6 모듈로 변경
*/

export class BadRequest extends Error {
    constructor(message = '잘못된 요청입니다.') {
        super(message);
        this.name = 'BadRequest';
        this.status = 400;
        this.data = null;
    }
}

export class Unauthorized extends Error {
    constructor(message = '인증되지 않은 요청입니다.') {
        super(message);
        this.name = 'Unauthorized';
        this.status = 401;
        this.data = null;
    }
}

export class Forbidden extends Error {
    constructor(message = '권한이 없습니다.') {
        super(message);
        this.name = 'Forbidden';
        this.status = 403;
        this.data = null;
    }
}

export class NotFound extends Error {
    constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
        super(message);
        this.name = 'NotFound';
        this.status = 404;
        this.data = null;
    }
}

export class RequestTimeout extends Error {
    constructor(message = '요청 시간이 만료되었습니다.') {
        super(message);
        this.name = 'RequestTimeout';
        this.status = 408;
        this.data = null;
    }
}

export class Conflict extends Error {
    constructor(message = '리소스 충돌이 발생했습니다.') {
        super(message);
        this.name = 'Conflict';
        this.status = 409;
        this.data = null;
    }
}

export class UnprocessableContent extends Error {
    constructor(message = '입력된 값이 유효하지 않거나 요청이 처리될 수 없습니다. 다시 확인해주세요.') {
        super(message);
        this.name = 'UnprocessableContent';
        this.status = 422;
        this.data = null;
    }
}

export class TooManyRequests extends Error {
    constructor(message = '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.') {
        super(message);
        this.name = 'TooManyRequests';
        this.status = 429;
        this.data = null;
    }
}
