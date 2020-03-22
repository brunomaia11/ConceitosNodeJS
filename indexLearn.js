const express = require('express');

const server = express();

server.use(express.json());

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método ${req.method}; Url ${req.url}`);
  next();
  console.timeEnd('Request');
});

function checkNomeExists (req, res, next) {
  if ( !req.body.nome ) {
    return res.status(400).json({error: 'Nome not found'});
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const {index} = req.params;
  if (!users[index]) {
    return res.status(400).json({error: 'Usuario não encontrado'});
  }
  req.user = users[index];
  return next();
}

const users = ['Bruno', 'Wagner', 'Gilson'];

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  //const nome = req.query.nome;
  return res.json(req.user);
});

server.post('/users', checkNomeExists, (req, res) => {
  const { nome } = req.body;
  users.push(nome);
  
  return res.json(users);
});

server.put('/users/:index', checkNomeExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { nome } = req.body;

  users[index] = nome;
  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  return res.json(users);
});

server.listen(3000);