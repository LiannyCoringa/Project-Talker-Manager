const express = require('express');
const fs = require('./fsFunctions');
const generateToken = require('./utils/generateToken');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const validateToken = require('./middlewares/validateToken');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');
const validateId = require('./middlewares/validateId');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talker = await fs.readFile();
  if (talker) {
    return res.status(200).send(talker);
  }
  return res.status(200).send({});
});

app.get('/talker/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const talker = await fs.readFile();
  const talkerName = await talker.filter((person) => person.name.includes(q));
  if (!q) {
    return res.status(200).json(talker);
  }
  if (talkerName.length === 0) {
    return res.status(200).json([]);
  }
  return res.status(200).json(talkerName);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await fs.readFile();
  const talkerId = await talker.find((person) => person.id === Number(id));
  if (talkerId === undefined) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(200).json(talkerId);
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.post('/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const talker = await fs.readFile();
    const { name, age, talk } = req.body;
    const { watchedAt, rate } = talk;
    const newTalker = {
      id: talker.length + 1,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
    talker.push(newTalker);
    await fs.writeFile(talker);
    return res.status(201).json(newTalker);
  });

app.put('/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  validateId,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const { watchedAt, rate } = talk;
    const talker = await fs.readFile();
    const talkerIndex = talker.findIndex((person) => person.id === Number(id));
    talker[talkerIndex] = {
      id: Number(id),
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
    await fs.writeFile(talker);
    res.status(200).json(talker[talkerIndex]);
  });

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talker = await fs.readFile();
  const talkerIndex = talker.findIndex((person) => person.id === Number(id));
  talker.splice(talkerIndex, 1);
  await fs.writeFile(talker);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
