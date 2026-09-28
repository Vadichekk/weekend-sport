import { getSettings } from "@/lib/settings";
import { AdminField } from "@/components/admin/field";
import { guardAdmin } from "../actions";
import { updateSettings } from "./actions";

const field = "w-full rounded-2xl bg-paper px-4 py-3";

export default async function AdminSettingsPage() {
  await guardAdmin();
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-4xl">Настройки</h1>
      <form action={updateSettings} className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">Оплата</h2>
        <AdminField label="Платёжный провайдер">
          <select name="paymentProvider" defaultValue={settings.paymentProvider} className={field}>
            <option value="mock">Тестовый мок</option>
            <option value="yookassa">ЮKassa</option>
            <option value="tkassa">Т-Касса</option>
            <option value="cloudpayments">CloudPayments</option>
          </select>
        </AdminField>
        <AdminField label="Shop ID / Terminal / Public ID">
          <input name="paymentShopId" defaultValue={settings.paymentShopId} className={field} />
        </AdminField>
        <AdminField
          label="Секретный ключ"
          hint={settings.paymentSecretKey ? "Ключ уже задан. Пустое поле его не сотрёт." : undefined}
        >
          <input
            name="paymentSecretKey"
            type="password"
            autoComplete="new-password"
            placeholder={settings.paymentSecretKey ? "••••••••" : ""}
            className={field}
          />
        </AdminField>
        <AdminField
          label="Секрет webhook"
          hint={settings.paymentWebhookSecret ? "Секрет уже задан. Пустое поле его не сотрёт." : undefined}
        >
          <input
            name="paymentWebhookSecret"
            type="password"
            autoComplete="new-password"
            placeholder={settings.paymentWebhookSecret ? "••••••••" : ""}
            className={field}
          />
        </AdminField>

        <h2 className="pt-4 font-display text-2xl">amoCRM</h2>
        <AdminField label="Домен amoCRM">
          <input name="amoDomain" defaultValue={settings.amoDomain} className={field} />
        </AdminField>
        <AdminField
          label="Access token"
          hint={settings.amoAccessToken ? "Токен уже задан. Пустое поле его не сотрёт." : undefined}
        >
          <input
            name="amoAccessToken"
            type="password"
            autoComplete="new-password"
            placeholder={settings.amoAccessToken ? "••••••••" : ""}
            className={field}
          />
        </AdminField>
        <AdminField label="Название воронки">
          <input name="amoPipelineName" defaultValue={settings.amoPipelineName} className={field} />
        </AdminField>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="amoEnabled" defaultChecked={settings.amoEnabled} />
          Включить живой amoCRM
        </label>

        <h2 className="pt-4 font-display text-2xl">Контакты на сайте</h2>
        <AdminField label="Телефон">
          <input name="contactPhone" defaultValue={settings.contactPhone} className={field} />
        </AdminField>
        <AdminField label="Email">
          <input name="contactEmail" defaultValue={settings.contactEmail} className={field} />
        </AdminField>
        <AdminField label="Адрес">
          <input name="contactAddress" defaultValue={settings.contactAddress} className={field} />
        </AdminField>
        <button className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream">
          Сохранить
        </button>
      </form>
    </div>
  );
}
