const express = require('express');

const server = express();

server.use(express.json());

const users = ['Adler','Rafael','Diego'];

server.use((req, res, next) => {
  console.log(req.url, req.method);

  next();
})

function checkUserExist(req, res, next){
  if(!req.body.name){
    res.status(400).json({error: "User does not exist"});
  }
  next();
}

function checkUserInArray(req, res, next){
  const { index } = req.params;
  const user = users[index]

  if(!user){
    res.status(400).json({error: "Index does not exist"});
  }

  req.user = user
  
  next();
}

server.post('/users', checkUserExist, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})

server.get('/users', (req, res) => {
  return res.json(users)
})

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
})

server.put('/users/:index', checkUserExist, checkUserInArray, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;

  return res.json(users)
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index }= req.params;

  console.log(`O usuário ${users[index]} foi excluido`);

  users.splice(index, 1);

  return res.send();
})

server.listen(3333);