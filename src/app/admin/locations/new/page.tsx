import { LocationForm } from "@/components/admin/location-form";
import { guardAdmin } from "../../actions";

export default async function NewLocationPage() {
  await guardAdmin();
  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Новая база</h1>
      <LocationForm />
    </div>
  );
}
