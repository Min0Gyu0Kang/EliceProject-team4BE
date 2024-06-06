// swagger 예제 코드 추후 삭제 예정
const { Router } = require("express");
var users = [
  { id: "chb2005", pw: "1234", nickname: "changbum" },
  { id: "alex123", pw: "a789", nickname: "alex" },
  { id: "h1997", pw: "h456!@#", nickname: "Harry" },
];

const router = Router();

/**
 * @swagger
 * paths:
 *  /user/nickname:
 *   post:
 *    tags:
 *    - user
 *    description: 닉네임 생성
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *       properties:
 *        id:
 *         type: string
 *        pw:
 *         type: string
 *
 *    responses:
 *     200:
 *      description: 닉네임 생성 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *     401:
 *      description: 닉네임 생성 실패
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 *
 */
router.post("/nickname", async (req, res, next) => {
  try {
    for (var i = 0; i < users.length; i++) {
      if (req.body.id == users[i].id) {
        if (req.body.pw == users[i].pw) {
          return res.status(200).json({
            message: "닉네임 : " + users[i].nickname,
          });
        } else {
          return res.status(401).json({
            message: "비밀번호가 틀렸습니다!",
          });
        }
      }
    }
    return res.status(401).json({
      messge: "아이디가 존재하지 않습니다!",
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

module.exports = router;
