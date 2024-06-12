const express = require('express');
const {Article} = require('../../models')
const router = express.Router();
const {Op} = require('sequelize')
const {NotFoundError, SuccessReq, FailureReq} = require('../../utils/response')
/* GET home page. */
// 查询
router.get('/', async function (req, res, next) {
    try {
        const query = req.query

        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const pageNum = Math.abs(Number(query.pageNum)) || 1

        const offset = (pageNum - 1) * pageSize


        const condition = {
            order: [['id', 'asc']],
            limit: pageSize,
            offset: offset
        }
        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }
        // 数据库查询是异步的，需要async...await
        const articles = await Article.findAndCountAll(condition)
        SuccessReq(res, "查询文章成功", {
            total: articles.count,
            data: articles.rows
        },)
    } catch (e) {
        FailureReq(res, e)
    }

});

// 查询某一个
router.get('/:id', async function (req, res, next) {
    try {
        const articles = await getArticle(req)


        SuccessReq(res, "查询文章成功", {
            articles
        })
    } catch (e) {
        FailureReq(res, e)
    }

});

// 新增
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req.body)
        let articles = await Article.create(body)
        SuccessReq(res, "文章新建成功", {
            articles
        }, 201)
    } catch (e) {
        FailureReq(res, e)
    }
})
// 更新文章
router.put("/:id", async function (req, res) {
    try {
        const articles = await getArticle(req)
        const body = filterBody(req)
        await articles.update(body)
        SuccessReq(res, "文章更新成功", {
            articles
        }, 200)
    } catch (e) {
        FailureReq(res, e)
    }

})

// 删除
router.delete("/:id", async function (req, res) {
    try {
        const articles = await getArticle(req)
        await articles.destroy()
        SuccessReq(res, "文章删除成功", {}, 200)
    } catch (e) {
        FailureReq(res, e)
    }
})

function filterBody(req) {
    return {
        title: req.title,
        content: req.content
    }
}


async function getArticle(req) {
    const {id} = req.params
    const article = await Article.findByPk(id)
    if (!article) {
        throw new NotFoundError(`ID: ${id}文章没有找到`)
    }
}

// 模糊查询
module.exports = router;