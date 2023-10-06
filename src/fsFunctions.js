const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();

const talkerPath = path.resolve(__dirname, './talker.json');

app.use(express.json());

const readFile = async () => {
  try {
    const data = await fs.readFile(talkerPath);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Arquivo não pode ser lido ${error}`);
  }
};

const writeFile = async (data) => {
  try {
    await fs.writeFile(talkerPath, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao escrever o arquivo ${error}`);
  }
};

module.exports = { readFile, writeFile };