const express = require('express');
const {Article} = require('../../models')
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    try {
        const condition = {
            order: [['id', 'desc']]
        }
        // 数据库查询是异步的，需要async...await
        const articles = await Article.findAll(condition)
        res.json({
            status: true,
            message: "查询文章成功",
            data: {
                articles
            }
        });
    } catch (e) {
        res.status(500).json({
            status: false,
            message: "查询失败",
            data: [e.message]
        })
    }

});

router.get('/:id', async function (req, res, next) {
    try {
        const {id} = req.params
        // 数据库查询是异步的，需要async...await
        const articles = await Article.findByPk(id)

        if(!articles){
            res.status(404).json({
                status: true,
                message: "未查找到数据"
            })
        }
        res.json({
            status: true,
            message: "查询文章成功",
            data: {
                articles
            }
        });
    } catch (e) {
        res.status(500).json({
            status: false,
            message: "查询失败",
            data: [e.message]
        })
    }

});

module.exports = router;