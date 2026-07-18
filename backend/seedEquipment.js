const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');

const items = [
  {
    name: 'SPP — Трафаретный принтер',
    description: 'Solder Paste Printer. Наносит паяльную пасту на контактные площадки платы через трафарет перед установкой компонентов.',
    photoUrl: '',
    status: 'active'
  },
  {
    name: 'SPI — Контроль пасты',
    description: 'Solder Paste Inspection. Проверяет качество и точность нанесения паяльной пасты после трафаретной печати.',
    photoUrl: '',
    status: 'active'
  },
  {
    name: 'SMT PCB-A — Линия установки компонентов',
    description: 'Автомат Pick and Place для точной установки SMD-компонентов на печатную плату.',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Juki_KE-2080L_by_Megger.jpg',
    status: 'active'
  },
  {
    name: 'Печь оплавления (Reflow Oven)',
    description: 'Конвейерная печь для оплавления паяльной пасты и формирования постоянных паяных соединений.',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Reflow_oven.jpg',
    status: 'active'
  },
  {
    name: 'AOI — Оптический контроль',
    description: 'Automated Optical Inspection. Проверяет качество пайки и правильность установки компонентов с помощью камер.',
    photoUrl: '',
    status: 'active'
  },
  {
    name: 'AGE room — Камера термотренировки',
    description: 'Помещение для длительной проверки платы под нагрузкой при повышенной температуре (burn-in), выявляет скрытые дефекты.',
    photoUrl: '',
    status: 'active'
  },
  {
    name: 'FT — Функциональное тестирование',
    description: 'Functional Test. Проверка платы в рабочем режиме на соответствие техническим характеристикам.',
    photoUrl: '',
    status: 'active'
  },
  {
    name: 'QC — Контроль качества',
    description: 'Quality Control. Финальная проверка готовой продукции перед отгрузкой.',
    photoUrl: '',
    status: 'active'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Подключено к MongoDB');

  await Equipment.deleteMany({});
  await Equipment.insertMany(items);

  console.log(`✅ Добавлено ${items.length} единиц оборудования`);
  mongoose.disconnect();
}

seed();