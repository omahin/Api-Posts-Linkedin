const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const apiPost = express.Router();
const app = express();
const PORT = 3333;

app.use(express.json());
app.use(cors());

const postsList = [];

// Model da postagem = id, content, format, data de criação, autor

// Cria uma nova postagem
apiPost.post('/posts', (req, res) => {
  const { content, format, author } = req.body;

  const newPost = {
    id: uuidv4(),
    content,
    format,
    created_at: new Date().toLocaleDateString('pt-BR'),
    author,
  };

  postsList.push(newPost);
  res.status(201).json({ message: `Postagem criada com sucesso!`, post: newPost });
});

// Lista todas as postagens
apiPost.get('/posts', (req, res) => {
  res.status(200).json(postsList);
});

// Lista uma postagem específica (usando queryParams -> ?id=id_gerado)
apiPost.get('/post', (req, res) => {
  const id = req.query.id;
  const postFound = postsList.find(post => post.id === id);

  if (!postFound) {
    return res.status(404).json({ message: 'Postagem não encontrada' });
  }

  res.json(postFound);
});

// Edita uma postagem específica
apiPost.patch('/post/:id', (req, res) => {
  const { id } = req.params;
  const { content, format, author } = req.body;

  const postFound = postsList.find(post => post.id === id);

  if (!postFound) {
    return res.status(404).json({ message: 'Postagem não encontrada' });
  }

  if (content != null) {
    postFound.content = content;
  }
  if (format != null) {
    postFound.format = format;
  }
  if (author != null) {
    postFound.author = author;
  }

  res.json({ message: `Postagem ${id} editada com sucesso!`, post: postFound });
});

// Excluir uma postagem específica
apiPost.delete('/post/:id', (req, res) => {
  const { id } = req.params;

  const postIndex = postsList.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Postagem não encontrada' });
  }

  postsList.splice(postIndex, 1);
  res.json({ message: 'Postagem excluída com sucesso'}).send();
});

app.use(apiPost)
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
