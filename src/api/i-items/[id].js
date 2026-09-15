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
    const id = Number(req.query.id);
    const iItems = loadIItems();
    const item = iItems.find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(item);
  } else if (req.method === 'DELETE') {
    const id = Number(req.query.id);
    const iItems = loadIItems();
    const prevLen = iItems.length;
    const filtered = iItems.filter(i => i.id !== id);
    if (filtered.length === prevLen) {
      return res.status(404).json({ error: 'Not found' });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(filtered, null, 2), 'utf8');
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
