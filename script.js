const fs = require('fs');
const knex = require('knex');
const f = fs.readFileSync('./yogaapi.json')
// const s = fs.readFileSync('./favorites.json')
const p = JSON.parse(s.toString())
// console.log(s)

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'panda007',
      database : 'hr'
    }
  });

 //inserted all the json file into a database
//   db('yogaposes')
//     .returning('*')
//     .insert(p)
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.log(err);
//     })

//  //inserted all the json file into a database
//   db('favorites')
//     .returning('*')
//     .insert(s)
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.log(err);
//     })