const express = require('express');
const readFile = require('./app');

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

app.listen(PORT, () => {
  console.log('Online');
});
