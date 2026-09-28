"use client";

import { useState } from "react";

const items = [
  {
    q: "С какого возраста берёте?",
    a: "Обычно 6–14 лет, на каждой базе свой коридор. Он указан в карточке. Если ребёнок на границе возраста — напишите, скажем честно.",
  },
  {
    q: "Родители едут вместе?",
    a: "Нет, это выезд группы с нашими тренерами. Вы получаете контакт куратора и короткий отчёт в конце дня.",
  },
  {
    q: "Что входит в цену?",
    a: "Программа, проживание на базе, питание, работа тренеров. Трансфер и карманные деньги — отдельно, если не указано иначе.",
  },
  {
    q: "Можно записать двоих детей или два заезда?",
    a: "Да. В корзину складываются разные базы и даты. На оформлении вы указываете имя и возраст каждого ребёнка.",
  },
  {
    q: "Как проходит оплата?",
    a: "Онлайн за конкретный заказ. Сейчас включён тестовый режим. Когда появятся реквизиты ЮKassa, Т-Кассы или CloudPayments — их вписывают в админке, код менять не нужно.",
  },
  {
    q: "Что если места кончились?",
    a: "Заезд закрывается автоматически. Можно выбрать другую дату или другую базу — корзина это умеет.",
  },
];

export function FaqList() {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-line rounded-[28px] bg-paper">
      {items.map((item, index) => {
        const active = open === index;
        return (
          <button
            key={item.q}
            className="block w-full px-6 py-5 text-left"
            onClick={() => setOpen(active ? -1 : index)}
          >
            <div className="flex items-start justify-between gap-6">
              <p className="font-semibold">{item.q}</p>
              <span className="text-muted">{active ? "–" : "+"}</span>
            </div>
            {active ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{item.a}</p> : null}
          </button>
        );
      })}
    </div>
  );
}
