// Простая файловая база для iItems
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'iItems.json');

function loadIItems() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Ошибка чтения iItems.json:', e);
  }
  return [];
}

function saveIItems(items) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2), 'utf8');
  } catch (e) {
    console.error('Ошибка записи iItems.json:', e);
  }
}

module.exports = { loadIItems, saveIItems, DATA_PATH };
