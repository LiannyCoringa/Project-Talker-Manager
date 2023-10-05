const express = require('express');
const readFile = require('./app');
const generateToken = require('./utils/generateToken');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talker = await readFile();
  if (talker) {
    return res.status(200).send(talker);
  }
  return res.status(200).send({});
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await readFile();
  const talkerId = await talker.find((person) => person.id === Number(id));
  if (talkerId === undefined) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(200).json(talkerId);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    return res.status(401).json({ message: 'Campos ausentes' });
  }
  const token = generateToken();
  return res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
