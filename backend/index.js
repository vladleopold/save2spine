const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());



// Массив проектов
const projects = [
  {
    "id": 1,
    "title": "",
    "description": "treehouse  - spine. ( 10h )",
    "images": ["http://spine-animator.ho.ua/gif/treehouse.webm", ""]
  },
  {
    "id": 2,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/chicken.gif",
      "http://spine-animator.ho.ua/gif/chicken_mesh.gif",
    "http://spine-animator.ho.ua/gif/chicken_skel.gif"]
  },
  {
    "id": 3,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/casinoxinst.gif", ""]
  },
  {
    "id": 4,
    "title": "",
    "description": "rodeo  - spine ( 5h )",
    "images": ["http://spine-animator.ho.ua/gif/rodeo.gif", ""]
  },
  {
    "id": 5,
    "title": "",
    "description": "",
    "images": ["https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmhuYXBobDZwbjZuZDFjMnZuYTBxaW96bHNidTY4NHZiYmhhM2E0aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4lOcXKbyMQTHYYHBeg/giphy.gif"]
  },
  {
    "id": 6,
    "title": "",
    "description": "dark ritual slot - After Effects ( 25h )",
    "images": ["http://spine-animator.ho.ua/gif/dr1.gif",
      "http://spine-animator.ho.ua/gif/dr2.gif"]
  },
  {
    "id": 7,
    "title": "idle slot symbol. - spine",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/giphy.webp", ""]
  },
  {
    "id": 8,
    "title": "",
    "description": "hammer. - spine",
    "images": ["http://spine-animator.ho.ua/gif/hammer.gif", ""]
  },
  {
    "id": 9,
    "title": "",
    "description": "knowledge  - spine ",
    "images": ["http://spine-animator.ho.ua/gif/knowledge3.gif",
      "http://spine-animator.ho.ua/gif/knowledge1.gif",
      "http://spine-animator.ho.ua/gif/knowledge2.gif"
      ]
      },
  {
    "id": 10,
    "title": "",
    "description": "",
    "images": [ "http://spine-animator.ho.ua/gif/cats.webp",
      "http://spine-animator.ho.ua/gif/knowledge4.webp"]
  },
  {
    "id": 11,
    "title": "",
    "description": "levels map  -  flash (.8h )",
    "images": ["http://spine-animator.ho.ua/gif/bhmap2.gif",
      "http://spine-animator.ho.ua/gif/bhmap1.gif"]
  },
  {
    "id": 12,
    "title": "",
    "description": "",
    "images": [, ""]
  },
  {
    "id": 13,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/bhfails.gif", ""]
  },
  {
    "id": 14,
    "title": "",
    "description": "slot high symbol  - spine ( 8h )",
    "images": ["http://spine-animator.ho.ua/gif/TZ_Merlin_prefinal.gif", ""]
  },
  {
    "id": 15,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 16,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 17,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 18,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 19,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 20,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 21,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 22,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 23,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 24,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 25,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 26,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 27,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 28,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 29,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 30,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 31,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 32,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/2021-03-06_04_26_59.gif", ""]
  },
  {
    "id": 33,
    "title": "",
    "description": "rodeo - game item  - spine ( 6h ) ",
    "images": ["http://spine-animator.ho.ua/gif/200.gif", ""]
  },
  {
    "id": 34,
    "title": "",
    "description": "facebook game - js",
    "images": ["http://spine-animator.ho.ua/gif/facebook.gif",
      "facebook_g"]
  },
  {
    "id": 35,
    "title": "",
    "description": "",
    "images": ["", ""]
  },
  {
    "id": 36,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/joyvi1.gif"]
  },
  {
    "id": 37,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/joyvipanda.gif", ""]
  },
  {
    "id": 38,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/slotoshara.gif", ""]
  },
  {
    "id": 39,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/slotoboom.gif", ""]
  },
  {
    "id": 40,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/sqbonus.gif", ""]
  },
  {
    "id": 41,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/sqheigh.gif",
      "http://spine-animator.ho.ua/gif/high_symbols.gif"]
  },
  {
    "id": 42,
    "title": "",
    "description": "",
    "images": [""]
  },
  {
    "id": 43,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/bomb_previev_05.gif",
      "http://spine-animator.ho.ua/gif/bomb_idle.gif"]
  },
  {
    "id": 44,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/strategy.gif", ""]
  },
  {
    "id": 45,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/strtgybig.gif", ""]
  },
  {
    "id": 46,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/space.gif", ""]
  },
  {
    "id": 47,
    "title": "",
    "description": "",
    "images": ["http://spine-animator.ho.ua/gif/uiface.gif", ""]
  }

];

// Эндпоинт для получения проектов с фото
app.get("/api/images", (req, res) => {
  // Фильтруем пустые строки и невалидные значения в images
  const cleanProjects = projects
    .map(project => ({
      ...project,
      images: Array.isArray(project.images)
        ? project.images.filter(src => typeof src === 'string' && src.trim() !== '')
        : []
    }))
    .filter(project => project.images.length > 0);
  res.json(cleanProjects);
});

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
