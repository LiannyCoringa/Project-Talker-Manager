const fs = require('../fsFunctions');

const validateId = async (req, res, next) => {
  const { id } = req.params;
  const talker = await fs.readFile();
  const talkerId = await talker.find((person) => person.id === Number(id));
  if (talkerId === undefined) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  next();
};

module.exports = validateId;