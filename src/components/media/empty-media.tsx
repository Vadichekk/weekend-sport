export function EmptyMedia({ title }: { title: string }) {
  return (
    <div className="rounded-[24px] bg-cream px-5 py-8 text-sm leading-6 text-muted">
      {title} пока нет — папка пустая. Когда загрузите файлы в админке, они появятся здесь.
    </div>
  );
}
