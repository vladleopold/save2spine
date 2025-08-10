// Массив для страницы /j
const jItems = [
    {
        id: 1,
        title: 'J demo 1',
        description: 'Описание J demo 1',
        images: ['https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif'],
        isFullWidth: false
    },
    {
        id: 2,
        title: 'J demo 2',
        description: 'Описание J demo 2',
        images: ['https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif'],
        isFullWidth: false
    }
]; 

// Получить j-items
app.get('/api/j-items', (req, res) => {
    res.json(jItems);
});

// Добавить новый j-item
app.post('/api/j-items', (req, res) => {
    const { title, description, images, isFullWidth } = req.body;
    if (!title || !Array.isArray(images)) {
        return res.status(400).json({ error: 'Некорректные данные' });
    }
    const id = jItems.length ? Math.max(...jItems.map(i => i.id)) + 1 : 1;
    const newItem = { id, title, description, images, isFullWidth };
    jItems.push(newItem);
    res.json({ success: true, item: newItem });
});
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());



// Массив проектов
const projects = [
    {
        "id": 0,
        "title": "",
        "description": "rodeo  - spine ( 5h )",
        "images": ["https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUybmRhaXdxY3B3cmpra2w2em1ibGI2Z283bmI0OXBma3BzY2E3OWg0MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMy5GaRRTmz01HMbyC/giphy.webp"]
    },
    {
        "id": 1,
        "title": "",
        "description": "treehouse  - spine. ( 10h )",
        "images": ["https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUybTgzcmZveWk4YzQxZTN5YWYwemtxcW5wZG0xd2pxeWpxZHZvNmFkciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BerqIjRJo79qKepITt/giphy.webp"
        , "https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyZndncG9pdTU4ZG5sd2RkZjZ0ajg2N2lrbG91dndmcjFxMms1YnF2OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1oEdjQdlOWqfDnBEP0/giphy.webp"
        ]
    },
    {
        "id": 2,
        "title": "",
        "description": "chicken - spine ( 8h )",
        "images": ["https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUydW13dDNuYnRobm1ycDlhNWtsYW91bmFldDN6YzBid3gwOHltNjg1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TZZFoJ2KTCKag8SHCG/giphy.webp",
            "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyMWVwYjVwOWhvdzA1NG83c3l3MHphdG9rcW93dWFvcnBnMm9oYm45eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cjw9Af81qWURmBaYv6/giphy.webp",
            "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnpxaGIyb3VoNXg3a3FhNW5tY2N2MzRyaGtycGRyM210MzZ0cDU2cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IaXx3aUshgmAOsv4Di/giphy.webp"
        , "https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyMXg2MnZybmlzMjVuaHgycW1leTkxODl1MHp6dzB6MjZwZXEyODJhaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3zLTv0ikwgmqjWLdqE/giphy.webp"
        ]
    },
        {
        "id": 3,
        "title": "idle slot symbol. - spine  ( 1h )",
        "description": "",
        "images": ["https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUybTY3YmplcDU0bHN0azluZGhxZTI0MzRhbHV2eDU2Mmhkam1yZDAxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cEwGaZHpaekqQ7joaP/giphy.webp"]
    },
    {
        "id": 4,
        "title": "",
        "description": "slot high symbol  - spine ( 8h )",
        "images": ["https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyODBhNW12NGNpOWh2am05czFsMnM3N2h6NzlpM2VjaXJndzg0N2d5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a9Cx1jkCyHGQmcTadG/giphy.webp"]
    },
    {
        "id": 5,
        "title": "",
        "description": "",
        "images": ["https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmhuYXBobDZwbjZuZDFjMnZuYTBxaW96bHNidTY4NHZiYmhhM2E0aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4lOcXKbyMQTHYYHBeg/giphy.gif"]
    },
    {
        "id": 7,
        "title": "",
        "description": "health and damge  - spine ( 6h )",
        "images": ["https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyMTIyaW50YmJqdmdjZ2VxcHg5MTlrcmw5amdyczR2bmx2cG5xcXJnZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tYeXaF0YNoYijlDzLv/giphy.webp"
            , "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUycWY0MnN2Y3FjbWU4dWhucnBlM2pnNm5zcjh0d2ZzdzJ6Nzg4c2M3YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4lOcXKbyMQTHYYHBeg/giphy.webp"
            , "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUydGhkZGhzbDJrZW40ajQxc3Z5a2xxNDhwcmVqZHFheGJxamM0Z2swcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4Bf7khDZyamqsPXqTJ/giphy.webp"
            , "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUycno1MXA3NnV1aXZ2cWNvdGozeWd4ZW5ldjhyaG1iOXc5aDVqMjQ2dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fx2QfvGT2z1LWnpM4F/giphy.webp"
        ]
    },
    {
        "id": 6,
        "title": "",
        "description": "dark ritual slot - After Effects ( 25h )",
        "images": ["http://spine-animator.ho.ua/gif/dr1.gif",
            "http://spine-animator.ho.ua/gif/dr2.gif"]
    },

    {
        "id": 8,
        "title": "",
        "description": "hammer. - spine  ( 4h )",
        "images": ["https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzk1eXl2aXhvdmg2NGFsdHFzZzQwdTQxY2YycG80bDl5aThyMHZrdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Yoyk8VjdEY3EH9DD14/giphy.webp"]
    },
    {
        "id": 9,
        "title": "",
        "description": "knowledge  - spine ( 8h ) ",
        "images": ["https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyZzBpdnJ1NXJta2UybjhtMnNqZHBhMGloZXgxbHl1dTJkbG5ybjBhayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KOUksd5twlFDRmBM67/giphy.webp",
            "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyNWltb2RsZGdqYmx0cWdpdXRmdDE1NWJ2YTU4OHI3YW11MTc3cTN6NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oYEzt0WBCERnj5B53D/giphy.webp",
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTVjNm91dDVueDNiYWJ1N202NzE5dzJpbndkdXF2eDBzNXdpbzlqdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Nyb4aYLjI7x5qOmRu4/giphy.webp"
        ]
    },
    {
        "id": 10,
        "title": "",
        "description": "pets cards  - spine ( 4h )",
        "images": ["https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyeXk1aDQ1ZmFzNG8wZjJpOWhocHA5aXJ2bmdqeHByb3g0aWRsaTE1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Vs3SXgqVHKq2c3PYWR/giphy.webp",
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXc3OWg5cmNxdDZyZDVza2lsMXJvc3FuZWhwc3F3ZnM2NXhhb2V5ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2kzZSnsldkTnRvXKPg/giphy.webp",
            "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyMnhpa20yaGRyczBhNHUyNmM3cHh0cjFvaXA1OHZvejAyamFwNms1MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/X8K3Ytja5MJ2BR26Lu/giphy.webp"
        ]
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
        "description": "french fontans hall  - spine ( 8h )",
        "images": ["https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUydzBmczBnemR4Mmk1aXI5dm14c2xwc3dvZ2gzczVna2J0bnd5ajlvcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oC9P648C0N9ULGUTmX/giphy.webp"]
    },
    {
        "id": 13,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/bhfails.gif"]
    },
    {
        "id": 14,
        "title": "",
        "description": "slot high symbol  - spine ( 8h )",
        "images": ["http://spine-animator.ho.ua/gif/TZ_Merlin_prefinal.gif"]
    },
    {
        "id": 15,
        "title": "",
        "description": "emmybomb  - spine ( 8h )",
        "images": ["https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdm55bTlpZXIyc3pwZHA3cHU5dzdhNWFiNGZrZDFhN242aDk1dWdmdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zCbTuEC6A9h9Ny5tAX/giphy.webp"]
    },
    {
        "id": 16,
        "title": "start and end game animation - spine ( 5h )",
        "description": "https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyeHI4cnJhcW9mYjBiYTNobjZvcGEzdmllMnk4MWl6em1uc3NuOGFlNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YvioIzaF6qmxG31x7s/giphy.webp",
        "images": []
    },
    {
        "id": 17,
        "title": "music player - spine ( 4h )",
        "description": "https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyenZ5NGtxbzBreTh1MHB0cnd1bGJqanBxNzQ3N2lpajNxbmx5dmlkMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PNpH7UFLQNxpEHVNSU/giphy.webp",
        "images": []
    },
    {
        "id": 32,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/2021-03-06_04_26_59.gif"]
    },
    {
        "id": 33,
        "title": "",
        "description": "rodeo - game item  - spine ( 6h ) ",
        "images": ["http://spine-animator.ho.ua/gif/200.gif"]
    },
    {
        "id": 34,
        "title": "",
        "description": "facebook game - js",
        "images": ["http://spine-animator.ho.ua/gif/facebook.gif",
            "facebook_g"]
    },
    {
        "id": 36,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/joyvi1.gif"],
        "isFullWidth": true // Указываем, что этот проект должен занимать все колонки
    },
    {
        "id": 37,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/joyvipanda.gif"]
    },
    {
        "id": 38,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/slotoshara.gif"]
    },
    {
        "id": 39,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/slotoboom.gif"]
    },
    {
        "id": 40,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/sqbonus.gif"]
    },
    {
        "id": 41,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/sqheigh.gif",
            "http://spine-animator.ho.ua/gif/high_symbols.gif"]
    },
    {"id": 42,"title": "","description": "","images": [""]},
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
        "images": ["http://spine-animator.ho.ua/gif/strategy.gif"]
    },
    {
        "id": 45,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/strtgybig.gif"]
    },
    {
        "id": 46,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/space.gif"]
    },
    {
        "id": 47,
        "title": "",
        "description": "",
        "images": ["http://spine-animator.ho.ua/gif/uiface.gif"]
    }

];

// Эндпоинт для получения проектов с фото

// Получить проекты
app.get("/api/images", (req, res) => {
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

// Добавить новый проект (админка)
app.post("/api/images", (req, res) => {
    const { id, title, description, images, isFullWidth } = req.body;
    if (typeof id !== 'number' || !Array.isArray(images)) {
        return res.status(400).json({ error: "Некорректные данные" });
    }
    projects.push({ id, title, description, images, isFullWidth });
    res.json({ success: true, project: { id, title, description, images, isFullWidth } });
});

// Массив для страницы /i
const iItems = [
  {
    id: 1,
    title: 'I demo 1',
    description: 'Описание I demo 1',
    images: ['https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif'],
    isFullWidth: false
  }
];

// Получить i-items
app.get('/api/i-items', (req, res) => {
  res.json(iItems);
});

// Добавить новый i-item
app.post('/api/i-items', (req, res) => {
  const { title, description, images, isFullWidth } = req.body;
  if (!Array.isArray(images)) {
    return res.status(400).json({ error: 'Некорректные данные' });
  }
  const id = iItems.length ? Math.max(...iItems.map(i => i.id)) + 1 : 1;
  const newItem = { id, title, description, images, isFullWidth };
  iItems.push(newItem);
  res.json({ success: true, item: newItem });
});

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
