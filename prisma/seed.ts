import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type MediaSeed = {
  kind: "photo" | "video";
  url: string;
  posterUrl?: string;
  alt: string;
  caption: string;
  category: "place" | "stay";
  sortOrder: number;
  isShared?: boolean;
};

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.paymentEvent.deleteMany();
  await prisma.amoJob.deleteMany();
  await prisma.order.deleteMany();
  await prisma.session.deleteMany();
  await prisma.media.deleteMany();
  await prisma.location.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.setting.deleteMany();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@weekend.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  const settings: Record<string, string> = {
    paymentProvider: process.env.PAYMENT_PROVIDER || "mock",
    paymentShopId: process.env.PAYMENT_SHOP_ID || "",
    paymentSecretKey: process.env.PAYMENT_SECRET_KEY || "",
    paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "",
    amoDomain: process.env.AMO_DOMAIN || "recordekb.amocrm.ru",
    amoAccessToken: process.env.AMO_ACCESS_TOKEN || "",
    amoPipelineName: process.env.AMO_PIPELINE_NAME || "СПОРТИВНЫЕ СЕКЦИИ",
    amoEnabled: process.env.AMO_ENABLED || "false",
    contactPhone: "+7 (343) 000-00-00",
    contactEmail: "hello@weekend.local",
    contactAddress: "Екатеринбург",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.create({ data: { key, value } });
  }

  const emptyCover = "/brand/cover-empty.svg";

  const locations = [
    {
      slug: "solnechnyy-ostrov",
      name: "Солнечный остров",
      district: "Сосновый бор, река Мостовая",
      address: "Загородный комплекс в сосновом бору",
      website: "https://sunbaza.ru/",
      shortDescription:
        "Сосны, коттеджи и открытый термальный бассейн. Сюда везём смену, когда хочется воздуха и спокойного двора.",
      description:
        "«Солнечный остров» — загородный комплекс в сосновом бору: номера, апартаменты и коттеджи, СПА с хамамом, сауной и джакузи. Главное, что запоминают дети — подогреваемый бассейн под открытым небом, он работает круглый год.\n\nРядом река Мостовая, у коттеджей электрогрили. В десяти минутах — питомник ездовых оленей: зимой упряжки, летом можно покормить оленей, кроликов и гусей.\n\nСвязь на территории ловит с перебоями, Wi‑Fi есть. Для смены это скорее плюс: меньше телефонов, больше живого общения.",
      conditions:
        "Выходные с проживанием в коттеджах или корпусе, питание, программа наших тренеров. Площадки подходят и для станций, и для коротких соревнований. Родители на смену не заезжают — куратор на связи.",
      safety:
        "Группа до 24 детей, два тренера и куратор. Бассейн и река — только с дежурным. Аптечка на месте, инструктаж в первый час.",
      ageMin: 7,
      ageMax: 13,
      amenities: [
        "Термальный бассейн под открытым небом",
        "Коттеджи и номера",
        "СПА и бани",
        "Река и бор",
        "Wi‑Fi, связь с перебоями",
      ],
      coverImage: "/media/bases/solnechnyy-ostrov/stay/photos/photo_1_2026-09-12_19-34-53.jpg",
      sortOrder: 1,
      media: [
        photo("solnechnyy-ostrov", "photo_1_2026-09-12_19-34-53", "Дети в сосновом бору поднимают руки", "Цветная станция в бору", 1),
        photo("solnechnyy-ostrov", "photo_3_2026-09-12_19-34-53", "Растяжка на пирсе у воды", "Утро у воды", 2),
        photo("solnechnyy-ostrov", "photo_4_2026-09-12_19-34-53", "Дети и взрослые после красок на поляне", "Команда после забега", 3),
        photo("solnechnyy-ostrov", "photo_2_2026-09-12_19-34-53", "Дети с грамотами в зале", "Финал смены", 4),
        video("solnechnyy-ostrov", "img_6561", "Короткое видео со смены", "Как мы там проводим время", 5),
        video("solnechnyy-ostrov", "img_1201", "Видео с выезда", "Станции на базе", 6),
        video("solnechnyy-ostrov", "img_1268", "Видео с выезда", "Движение во дворе", 7),
        video("solnechnyy-ostrov", "img_1664", "Видео с выезда", "Общий кадр смены", 8),
        video("solnechnyy-ostrov", "img_1337", "Видео с выезда", "Ещё кадр смены", 9),
        video("solnechnyy-ostrov", "img_1758", "Видео с выезда", "Двор и движение", 10),
        video("solnechnyy-ostrov", "img_1519", "Видео с выезда", "Длиннее нарезка", 11),
        video("solnechnyy-ostrov", "img_4497", "Видео с выезда", "Ещё ролик", 12),
      ] satisfies MediaSeed[],
      sessions: [
        { start: "2026-09-19", end: "2026-09-20", price: 8900, capacity: 24, left: 9 },
        { start: "2026-10-03", end: "2026-10-04", price: 8900, capacity: 24, left: 18 },
        { start: "2026-10-17", end: "2026-10-18", price: 9200, capacity: 24, left: 24 },
      ],
    },
    {
      slug: "park-skazov",
      name: "Парк Сказов",
      district: "Арамиль, 6 гектаров парка",
      address: "Первый на Урале тематический парк по сказам Бажова",
      website: "https://parkskazov.ru/",
      shortDescription:
        "Сказы Бажова, интерактивные программы и площадки во дворе. Смена с сюжетом, не только со спортом.",
      description:
        "Парк Сказов — тематический парк на Урале: русские сказки и сказы П. П. Бажова. На шести гектарах детей встречают герои, проводят короткие представления и задают загадки.\n\nДля организованных групп есть регулярные и событийные программы, праздники и фестивали. На территории — ресторан, авторские дома, парк-отель «Сорока», бассейн, «босоногий парк», немецкая площадка по мотивам Гримм, батут, зимой — коньки и тюбинг.\n\nМы берём это место, когда нужна смена с историей: утром станции и спорт, днём — сюжет парка, без ростовых кукол «из конструктора».",
      conditions:
        "Заезд на выходные, проживание в парк-отеле или соседнем корпусе по договору, питание. Часть программы — наша, часть площадок парка бронируем заранее.",
      safety:
        "Группа до 22 детей. Аттракционы и бассейн — только с тренером. Территория парка закрытая, выход за контур по списку.",
      ageMin: 6,
      ageMax: 12,
      amenities: ["Сказочные площадки", "Бассейн", "Босоногий парк", "Ресторан", "Парк-отель «Сорока»"],
      coverImage: emptyCover,
      sortOrder: 2,
      media: [] satisfies MediaSeed[],
      sessions: [
        { start: "2026-09-26", end: "2026-09-27", price: 8600, capacity: 22, left: 12 },
        { start: "2026-10-24", end: "2026-10-25", price: 8600, capacity: 22, left: 22 },
      ],
    },
    {
      slug: "khrustalnaya",
      name: "Хрустальная",
      district: "25 км от Екатеринбурга",
      address: "Территория семейного отдыха «Хрустальная»",
      website: "https://crystalbaze.ru/",
      shortDescription:
        "Близко к городу, бассейны и нормальный сервис. Удобная база для первых выездов и спортсборов.",
      description:
        "«Хрустальная» — современная территория семейного отдыха в 25 километрах от Екатеринбурга. Комфортное размещение, открытый и закрытый бассейны, СПА, кафе.\n\nБаза регулярно принимает школьные выезды, выпускные, тренинги и спортивные сборы. Есть прокат инвентаря, беседки, мангалы, футбольное поле.\n\nДля нашего уикенда это спокойный вариант: недалеко ехать, есть крытый запас на дождь и вода, если смена объявлена оздоровительной.",
      conditions:
        "Номера, питание для группы, зал и улица. Трансфер обсуждается отдельно. Можно записать двоих детей в одну смену.",
      safety:
        "Группа до 22 детей. Бассейн и сауна — по графику и с дежурным. Список вещей приходит после оплаты.",
      ageMin: 6,
      ageMax: 14,
      amenities: ["Открытый и закрытый бассейны", "СПА", "Спортплощадки", "Кафе", "Близко к городу"],
      coverImage: emptyCover,
      sortOrder: 3,
      media: [] satisfies MediaSeed[],
      sessions: [
        { start: "2026-10-10", end: "2026-10-11", price: 8200, capacity: 22, left: 16 },
        { start: "2026-11-07", end: "2026-11-08", price: 7900, capacity: 22, left: 22 },
      ],
    },
    {
      slug: "baden-baden",
      name: "Баден-Баден",
      district: "Сеть: Еткуль, Таватуй, Уктус",
      address: "Термальные курорты в Свердловской и Челябинской областях",
      website: "https://baden-baden.ru/",
      shortDescription:
        "Термы, вода и детский клуб. Берём локацию сети под конкретную смену — озеро или город.",
      description:
        "«Баден-Баден» — сеть термальных курортов. Для выездного уикенда нам ближе три площадки.\n\nЕткуль, Челябинская область: берег озера, 40 км от Челябинска. Гостиница, рестораны, открытые и закрытые термы, бани. Есть BadenKids со скалодромом, площадки, анимация и мастер-классы. Питание — завтрак и шведский стол.\n\nТаватуй, Свердловская область: берег Верх-Нейвинского водохранилища, район Новоуральска. Термы и природа, смена с водой и прогулками.\n\nУктус в Екатеринбурге — городской комплекс: бани, СПА, пляжная зона. Берём на дневной выезд, если ночёвка не нужна.\n\nВ сети также Сысерть (дома) и строящийся «Зелёный мыс» у Таватуя — их подключим, когда закроем даты. Какую именно площадку открываем в конкретный заезд, видно в карточке даты.",
      conditions:
        "Проживание в гостинице или апартаментах выбранного комплекса, питание, термы по расписанию смены. Детский клуб — если площадка Еткуль.",
      safety:
        "Термы и вода только группой с тренером. На Еткуле ориентир — инфраструктура BadenKids. Группа до 20 детей.",
      ageMin: 6,
      ageMax: 13,
      amenities: ["Термальные бассейны", "BadenKids", "Гостиница", "Питание", "Несколько локаций сети"],
      coverImage: emptyCover,
      sortOrder: 4,
      media: [] satisfies MediaSeed[],
      sessions: [
        { start: "2026-10-17", end: "2026-10-18", price: 9800, capacity: 20, left: 11 },
        { start: "2026-11-21", end: "2026-11-22", price: 9800, capacity: 20, left: 20 },
      ],
    },
    {
      slug: "peski",
      name: "Пески",
      district: "Шарташский лесопарк, Екатеринбург",
      address: "Загородный клуб у озера Шарташ, 35 минут из центра",
      website: "https://peski13.ru/",
      shortDescription:
        "В черте города, но в лесу у Шарташа. Верёвки, скалодром и командные игры — смена с приключением.",
      description:
        "Клуб «Пески» стоит в Шарташском лесопарке у озера Шарташ. Из центра Екатеринбурга — около 35 минут на городском транспорте, личная машина не обязательна.\n\nЖить можно в русских избах с полатями и печью или в деревянных домиках посовременнее. На территории два ресторана, баня на дровах, беседки, юрты и шатры.\n\nДля детей главное — парк «Казаки-Разбойники»: верёвочные трассы «Ползалка» (5–9 лет), «Лазалка» (от 10), «Экстрим» (от 14) и ZIP-спуск «Скорость». Есть скалодром 11 метров, «Свободное падение» с 16 метров для детей от 10 и качели «Пучеглазик» для малышей.\n\nЕсть пейнтбол и лазертаг от 8 человек (дети с 12, лучше в смешанных командах), лесной тир, квесты вроде «Сокровище Песков» и «Ну, погоди!». Мы собираем из этого спортивную смену, а не день рождения с аниматорами — костюмы и «Маугли» оставляем как опцию, если заезд так объявлен.",
      conditions:
        "Выходные с ночёвкой в избе или домике, питание в ресторанах клуба. Верёвочный парк и квесты — по предварительной записи, группы от 8 человек клуб принимает в любой день.",
      safety:
        "Страховка на трассах парка обязательна, возрастные ограничения соблюдаем. Тир и пейнтбол — только с инструктором клуба. Группа до 20 детей, два наших тренера плюс инструкторы площадки.",
      ageMin: 7,
      ageMax: 14,
      amenities: [
        "Верёвочный парк",
        "Скалодром 11 м",
        "Шарташ и лес",
        "Избы и домики",
        "35 минут из центра",
      ],
      coverImage: "/media/bases/peski/stay/posters/img_0063.jpg",
      sortOrder: 5,
      media: [
        video("peski", "img_0063", "Видео с выезда в Пески", "Как мы там проводим время", 1),
        video("peski", "img_0381", "Видео с выезда в Пески", "Площадки клуба", 2),
        video("peski", "img_9887", "Видео с выезда в Пески", "Движение на смене", 3),
        video("peski", "img_0015", "Видео с выезда в Пески", "Лес и двор", 4),
        video("peski", "img_0213", "Видео с выезда в Пески", "Ещё кадр смены", 5),
      ] satisfies MediaSeed[],
      sessions: [
        { start: "2026-09-19", end: "2026-09-20", price: 7800, capacity: 20, left: 5 },
        { start: "2026-10-31", end: "2026-11-01", price: 7800, capacity: 20, left: 20 },
        { start: "2026-11-14", end: "2026-11-15", price: 7500, capacity: 20, left: 0 },
      ],
    },
  ];

  function photo(slug: string, stem: string, alt: string, caption: string, sortOrder: number): MediaSeed {
    return {
      kind: "photo",
      url: `/media/bases/${slug}/stay/photos/${stem}.jpg`,
      alt,
      caption,
      category: "stay",
      sortOrder,
      isShared: slug === "solnechnyy-ostrov",
    };
  }

  function video(slug: string, stem: string, alt: string, caption: string, sortOrder: number): MediaSeed {
    return {
      kind: "video",
      url: `/media/bases/${slug}/stay/videos/${stem}.mp4`,
      posterUrl: `/media/bases/${slug}/stay/posters/${stem}.jpg`,
      alt,
      caption,
      category: "stay",
      sortOrder,
    };
  }

  for (const item of locations) {
    const location = await prisma.location.create({
      data: {
        slug: item.slug,
        name: item.name,
        district: item.district,
        address: item.address,
        website: item.website,
        shortDescription: item.shortDescription,
        description: item.description,
        conditions: item.conditions,
        safety: item.safety,
        ageMin: item.ageMin,
        ageMax: item.ageMax,
        amenities: JSON.stringify(item.amenities),
        coverImage: item.coverImage,
        published: true,
        sortOrder: item.sortOrder,
      },
    });

    if (item.media.length) {
      await prisma.media.createMany({
        data: item.media.map((entry) => ({ ...entry, locationId: location.id })),
      });
    }

    for (const session of item.sessions) {
      const spotsLeft = session.left;
      await prisma.session.create({
        data: {
          locationId: location.id,
          startDate: new Date(`${session.start}T08:00:00`),
          endDate: new Date(`${session.end}T18:00:00`),
          pricePerChild: session.price,
          capacity: session.capacity,
          spotsLeft,
          status: spotsLeft <= 0 ? "closed" : spotsLeft <= 4 ? "few" : "open",
          published: true,
        },
      });
    }
  }

  console.log("Seed ready: 5 bases");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
