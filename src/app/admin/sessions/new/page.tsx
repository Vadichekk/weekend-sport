import { prisma } from "@/lib/prisma";
import { SessionForm } from "@/components/admin/session-form";
import { guardAdmin } from "../../actions";

export default async function NewSessionPage() {
  await guardAdmin();
  const locations = await prisma.location.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Новый заезд</h1>
      <SessionForm locations={locations} />
    </div>
  );
}
