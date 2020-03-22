const express = require('express');
const server = express();
const projects = [];

server.use(express.json());
server.use((req, res, next) => {
  console.count('Nº Requisições');
  next();
});

function checkIdExists(req, res, next) {
  const {id} = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({error:'Projeto não encontrado'});
  }
  req.project = project;
  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkIdExists, (req, res) => {
  return res.json(req.project);
});

server.post('/projects', (req, res) => {
  const {id, title} = req.body;
  projects.push({
    'id': id,
    'title': title,
    'task': [] 
  });
  return res.json(projects);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const {title} = req.body;
  req.project.title = title;
  return res.json(req.project);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  projects.slice(req.project, 1);
  return res.send();
});

server.post('/projects/:id/task', checkIdExists, (req, res) => {
  const {title} = req.body;
  req.project.task.push({
    title
  });
  return res.json(projects);
});

server.listen(4000);