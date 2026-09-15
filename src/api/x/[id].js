const { ix } = require('./data');

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    const id = Number(req.query.id);
    const item = ix.find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(item);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
