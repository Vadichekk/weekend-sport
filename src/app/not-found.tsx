import { Header } from "@/components/site/header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="font-display text-5xl">Страница не найдена</h1>
        </div>
      </div>
      <div className="mx-auto max-w-lg px-4 py-12">
        <Button href="/">На главную</Button>
      </div>
    </main>
  );
}
