var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'sql.db4free.net',
    user : 'abdo_ecommrce',
    password : 'arh.27934',
    database : 'ecommerce2'
  }
});
module.exports=knex
