建表
`sequelize model:generate --name Article --attributes title:string,content:text`
迁移:
`sequelize db:migrate`

生成种子文件:
`sequelize seed:generate --name article`