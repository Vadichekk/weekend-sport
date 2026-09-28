import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SessionForm } from "@/components/admin/session-form";
import { guardAdmin } from "../../actions";
import { deleteSession } from "../actions";

export default async function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  await guardAdmin();
  const { id } = await params;
  const [session, locations] = await Promise.all([
    prisma.session.findUnique({ where: { id } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!session) notFound();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl">Заезд</h1>
      <SessionForm locations={locations} session={session} />
      <form action={deleteSession}>
        <input type="hidden" name="id" value={session.id} />
        <button className="text-sm text-red-700">Удалить заезд</button>
      </form>
    </div>
  );
}
