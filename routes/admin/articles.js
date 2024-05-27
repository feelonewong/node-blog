const express = require('express');
const {Article} = require('../../models')
const router = express.Router();
const {Op} = require('sequelize')
/* GET home page. */
// 查询
router.get('/', async function (req, res, next) {
    try {
        const query = req.query

        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const pageNum = Math.abs(Number(query.pageNum)) || 1

        const offset = (pageNum -1) * pageSize


        const condition = {
            order: [['id', 'asc']],
            limit: pageSize,
            offset: offset
        }
        if(query.title){
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }
        // 数据库查询是异步的，需要async...await
        const articles = await Article.findAndCountAll(condition)
        res.json({
            status: true,
            message: "查询文章成功",
            data: {
                total: articles.count,
                data: articles.rows
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

// 查询某一个
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

// 新增
router.post('/', async function(req, res){
    try {
        let articles = await Article.create(req.body)
        res.status(201).json({
            status: true,
            message: "文章新建成功",
            data: {
                articles
            }
        });
    }catch (e) {
        res.status(500).json({
            status: true,
            message:"新建文章失败",
            data: e.message
        })
    }
})

// 删除
router.delete("/:id", async function(req, res){
    try {
        const {id} = req.params
        const articles = await Article.findByPk(id)
        if(!articles){
            res.status(404).json({
                status: true,
                message: "未查找到数据"
            })
        }else {
            await articles.destroy()
            res.status(200).json({
                status: true,
                message:"删除成功"
            })
        }
    }catch (e) {
        res.status(500).json({
            status: true,
            message:"删除失败",
            data: e.message
        })
    }
})

// 更新文章
router.put("/:id", async  function(req, res){
    const {id} = req.params
    const articles = await Article.findByPk(id)

    if(!articles){
        res.status(404).json({
            status: true,
            message: "未查询到数据"
        })
    }else{
        await articles.update(req.body)
        res.status(200).json({
            status: true,
            message: "更新成功"
        })
    }
})

// 模糊查询
module.exports = router;