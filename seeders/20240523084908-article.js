'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const articles = []
    const counts = 100
    for (let i = 0; i <= counts; i++) {
      const article = {
        title: `文章标题${i}`,
        content: `文章内容${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      articles.push(article)
    }

    await  queryInterface.bulkInsert('Articles', articles, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
//sequelize db:seed --seed 20240523084908-article