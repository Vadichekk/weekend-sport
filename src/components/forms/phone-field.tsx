"use client";

import { useState } from "react";
import { formatPhoneInput, isValidRuPhone } from "@/lib/utils";

export function PhoneField({
  name = "parentPhone",
  defaultValue = "",
}: {
  name?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const valid = !value || isValidRuPhone(value);

  return (
    <label className="block text-sm">
      Телефон
      <input
        required
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 (900) 000-00-00"
        pattern="\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}"
        title="Российский номер: +7 (XXX) XXX-XX-XX"
        value={value}
        onChange={(event) => setValue(formatPhoneInput(event.target.value))}
        className="mt-2 w-full rounded-2xl bg-cream px-4 py-3 outline-none ring-1 ring-black/5"
      />
      {!valid ? (
        <span className="mt-2 block text-xs text-red-700">
          Нужен российский номер: +7 и 10 цифр, например +7 (912) 345-67-89
        </span>
      ) : (
        <span className="mt-2 block text-xs text-muted">Формат: +7 (XXX) XXX-XX-XX</span>
      )}
    </label>
  );
}
