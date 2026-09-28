import Image from "next/image";
import { Header } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { LocationCard } from "@/components/locations/location-card";
import { VideoCard } from "@/components/media/video-card";
import { ClickablePhoto } from "@/components/media/clickable-photo";
import { PhotoCarousel } from "@/components/media/photo-carousel";
import { FaqList } from "@/components/faq/faq-list";
import { getPublishedLocations, getSharedMedia } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { formatRange } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const [locations, media, settings] = await Promise.all([
    getPublishedLocations(),
    getSharedMedia(),
    getSettings(),
  ]);
  const videos = media.filter((item) => item.kind === "video");
  const photos = media.filter((item) => item.kind === "photo").map((item) => ({
    id: item.id,
    url: item.url,
    alt: item.alt,
    caption: item.caption,
  }));
  const weekendShots = [
    {
      title: "Суббота",
      text: "Заезд, знакомство, разминка, станции на улице. Вечером тише: зал или костёр, без ночных квестов.",
      image: "/media/bases/solnechnyy-ostrov/stay/photos/photo_3_2026-09-12_19-34-53.jpg",
      alt: "Растяжка у воды",
    },
    {
      title: "Воскресенье",
      text: "Игры, эстафеты, цветная станция если позволяет база. После обеда — грамоты и выезд.",
      image: "/media/bases/solnechnyy-ostrov/stay/photos/photo_4_2026-09-12_19-34-53.jpg",
      alt: "Цветной праздник на поляне",
    },
    {
      title: "Что с вами",
      text: "Куратор пишет, если нужно. В конце смены — короткое фото и список, кто как держался.",
      image: "/media/bases/solnechnyy-ostrov/stay/photos/photo_2_2026-09-12_19-34-53.jpg",
      alt: "Дети с грамотами",
    },
  ];
  const weekendGallery = weekendShots.map((item) => ({
    id: item.image,
    url: item.image,
    alt: item.alt,
  }));

  return (
    <main>
      <section className="relative min-h-[92vh] overflow-hidden bg-forest text-white">
        <Image
          src="/media/bases/solnechnyy-ostrov/stay/photos/photo_1_2026-09-12_19-34-53.jpg"
          alt="Дети в сосновом бору поднимают руки"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,30,26,0.35)_0%,rgba(18,30,26,0.55)_45%,rgba(18,30,26,0.88)_100%)]" />
        <Header inverted />
        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
          <p className="text-xs uppercase tracking-[0.28em] text-white/70">
            Выездной детский спорт
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            Уикенд за городом.<br />Дети в деле, вы спокойны.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 md:text-lg">
            Берём группу на проверенную базу на субботу–воскресенье: программа, тренеры,
            ночёвка. Вы выбираете место по нашим кадрам и конкретную дату заезда.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/bases">Смотреть базы</Button>
            <Button href="#atmosphere" variant="ghost">
              Как мы там проводим время
            </Button>
          </div>
          <div className="mt-10 grid gap-4 text-sm text-white/75 sm:grid-cols-3">
            <p>6–14 лет, группы до 24 детей</p>
            <p>Свои тренеры, не анимация парка</p>
            <p>Оплата за заезд, без бонусных карт</p>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Как проходит уикенд</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Два дня. Одна группа. Нормальная нагрузка.</h2>
          </div>
          <p className="text-muted">
            Не конструктор праздника и не парк аттракционов. Это выезд секции: утро, станции,
            еда, сон, ещё один день — и домой.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {weekendShots.map((item, index) => (
            <article key={item.title} className="overflow-hidden rounded-[28px] bg-paper ring-1 ring-black/5">
              <ClickablePhoto
                src={item.image}
                alt={item.alt}
                className="aspect-[5/4] w-full"
                sizes="(max-width: 768px) 100vw, 400px"
                items={weekendGallery}
                startIndex={index}
              />
              <div className="p-6">
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="atmosphere" className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Живые кадры</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Так это выглядит, когда мы уже на месте</h2>
            <p className="mt-4 text-cream/70">
              Кадры с выездов. Карусель листается сама, фото можно открыть и увеличить.
              Новые снимки добавляются в админке, в разделе «Визуал».
            </p>
          </div>
          {photos.length ? (
            <div className="mt-10">
              <PhotoCarousel items={photos} />
            </div>
          ) : null}
          {videos.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {videos.slice(0, 2).map((video) => (
                <VideoCard
                  key={video.id}
                  src={video.url}
                  poster={video.posterUrl}
                  caption={video.caption}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Каталог</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Куда едем</h2>
          </div>
          <Button href="/bases" variant="line" className="hidden md:inline-flex">
            Все базы
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {locations.map((location) => (
            <LocationCard key={location.id} {...location} />
          ))}
        </div>
      </section>

      <section id="steps" className="bg-bg-deep">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <h2 className="font-display text-4xl md:text-5xl">Четыре шага, без калькулятора бонусов</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              { n: "01", t: "База", d: "Читаете место: лес, озеро, зал на дождь, возраст." },
              { n: "02", t: "Атмосфера", d: "Смотрите наши фото и видео с этой площадки." },
              { n: "03", t: "Дата", d: "Выбираете заезд и сколько детей едет." },
              { n: "04", t: "Оплата", d: "Корзина может быть из нескольких баз. Потом оформление." },
            ].map((step) => (
              <div key={step.n} className="rounded-[24px] bg-paper p-6">
                <p className="text-xs tracking-[0.2em] text-clay">{step.n}</p>
                <h3 className="mt-3 font-display text-2xl">{step.t}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">FAQ</p>
            <h2 className="mt-3 font-display text-4xl">Коротко для родителей</h2>
            <p className="mt-4 text-muted">
              Если не нашли ответ — {settings.contactPhone}. Номер-заглушка, его меняют в админке.
            </p>
          </div>
          <FaqList />
        </div>
      </section>

      <section id="contacts" className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="overflow-hidden rounded-[32px] bg-forest text-cream">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="font-display text-4xl">Напишите, если выбираете между базами</h2>
              <p className="mt-4 max-w-md text-cream/70">
                Подскажем, куда спокойнее в первый раз и где осталось место на ближайшие выходные.
              </p>
              <div className="mt-8 space-y-2 text-sm">
                <p>{settings.contactPhone}</p>
                <p>{settings.contactEmail}</p>
                <p>{settings.contactAddress}</p>
              </div>
              {locations[0]?.sessions[0] ? (
                <p className="mt-8 text-sm text-cream/60">
                  Ближайший открытый заезд: {locations[0].name},{" "}
                  {formatRange(locations[0].sessions[0].startDate, locations[0].sessions[0].endDate)}, от{" "}
                  {formatPrice(locations[0].sessions[0].pricePerChild)}
                </p>
              ) : null}
            </div>
            <ClickablePhoto
              src="/media/bases/solnechnyy-ostrov/stay/photos/photo_3_2026-09-12_19-34-53.jpg"
              alt="Дети у воды"
              className="min-h-72 w-full"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
