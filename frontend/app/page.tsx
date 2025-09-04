import PatientTable from "@/components/PatientTable";

export default function HomePage() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">REMAP-CAP v2.4</h2>
      <PatientTable />
    </section>
  );
}
