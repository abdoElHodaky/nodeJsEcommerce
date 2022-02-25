var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.DATABASE_HOST         || 'sql.db4free.net',
    user : process.env.DTATBASE_USER         || 'abdo_ecommrce',
    password : process.env.DATABASE_PASSWORD || 'arh.27934',
    database : process.env.DATABASE_NAME     || 'ecommerce2'
  }
});
module.exports=knex
