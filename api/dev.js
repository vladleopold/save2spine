const { dev } = require('./data');

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(dev);
  } else if (req.method === 'POST') {
    const { title, description, images, isFullWidth } = req.body;
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }
    const id = dev.length ? Math.max(...dev.map(i => i.id)) + 1 : 1;
    const newItem = { id, title, description, images, isFullWidth };
    dev.push(newItem);
    res.status(201).json({ success: true, item: newItem });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
