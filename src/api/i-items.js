const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(process.cwd(), 'api', 'i-items-store.json');

function loadIItems() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
  } catch (e) {}
  return [];
}

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    const iItems = loadIItems();
    res.status(200).json(iItems);
  } else if (req.method === 'POST') {
    const { title, description, images, isFullWidth } = req.body;
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }
    const iItems = loadIItems();
    const id = iItems.length ? Math.max(...iItems.map(i => i.id)) + 1 : 1;
    const newItem = { id, title, description, images, isFullWidth };
    iItems.push(newItem);
    fs.writeFileSync(DATA_PATH, JSON.stringify(iItems, null, 2), 'utf8');
    res.status(201).json({ success: true, item: newItem });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
