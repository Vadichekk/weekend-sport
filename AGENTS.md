# Уикенд — контекст для Cursor

Сайт записи на выездной детский спортивный уикенд. Стек: Next.js 15 App Router, TypeScript, Prisma + SQLite, Tailwind v4.

## Запуск

Нужен Node.js 20+. Из корня проекта:

```bat
npm install
npm run dev
```

Открыть http://localhost:3000. Не запускать `npm run setup` или `npm run db:reset`, если есть `prisma/dev.db` — это сотрёт заказы.

Админка `/admin`: локально `admin@weekend.local` / `admin1234`. Кабинет родителя — телефон + пароль с оформления.

## Важно

- Покупка привязана к заезду (база + даты), не к абонементу.
- Медиа баз: `public/media/bases/{slug}/place|stay`. Админские загрузки: `public/uploads`.
- Оплата: `PaymentProvider` (`mock` / ЮKassa / Т-Касса / CloudPayments). На проде мок закрыт.
- Не коммитить `.env` и `prisma/dev.db`. Не пушить секреты.
- UI-правки проверять в браузере по затронутым страницам.
- Коммиты — только если пользователь явно попросил.
