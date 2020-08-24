const knex = require('knex');
const pws = require('p4ssw0rd');
const { response } = require('express');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'panda007',
    database : 'hr'
  }
});


const createUser = ({ fname,lname,email, password }) => {
  return db('users')
    .returning('*')
    .insert({fname: fname,
             lname: lname,
             email: email.toLowerCase(),
             password: pws.hash(password,10),
             createdat: new Date(),
             updatedat: new Date()});
}

const findUser = (email) => {
  return db.select('*')
    .from('users')
    .where({email})
}

const sFavorites = (u_id, p_id) => {
  return db('favorites')
  .returning('*')
  .insert({users_id:u_id, pose_id:p_id})
}

const myFavorites = () => {
  return db.select('*')
  .from('favorites')
}

// simple showcase the db:
// const getAllPoses = () => {
//   return db.select('*')
//   .from('yogaposes')
// }

const getAllPoses = (id) => {
  return db.select('*')
  .from('yogaposes')
  .fullOuterJoin('favorites', 'favorites.pose_id', 'yogaposes.id' )
  .select('favorites.pose_id', 'yogaposes.id', 'yogaposes.sanskrit_name', 'yogaposes.english_name', 'yogaposes.img_url')
  .where ({'favorites.users_id':id}) 
  .orWhereNull('favorites.users_id')
}

// const getAllPoses = (user_id) => {
//   return db.select('*')
//   .from('yogaposes')
//   .where ({user_id}) .from('favorites'))
// }

// const showFavorites = (users_id, pose_id) => {
//   return db.select('*')
//   .from('favorites')
//   .where ({id:users_id} .from('users')
//   .where ({id:pose_id} .from('yogaposes'))
// }

module.exports = {
  findUser,
  createUser,
  getAllPoses,
  myFavorites,
  sFavorites
};
