import PatientDetailPage from "@/components/PatientDetailPage";

interface PatientDetailProps {
  params: {
    patient_id: string;
  };
}

async function getPatient(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/patient/${id}`,
    {
      cache: "no-store",
    }
  );
  console.log('res: ', res);
  if (!res.ok) return null;
  return res.json();
}

export default async function PatientDetail({ params }: PatientDetailProps) {
  const { patient_id } = await params;
  const patient = await getPatient(patient_id);
  console.log('patient: ', patient);

  if (!patient) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-medium">
          Patient not found: {patient_id}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PatientDetailPage patient={patient} />
    </div>
  );
}
