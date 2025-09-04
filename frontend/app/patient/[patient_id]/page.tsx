import PatientDetailPage from "@/components/PatientDetailPage";
import { API_BASE_URL } from "@/contanst";

interface PatientDetailProps {
  params: {
    patient_id: string;
  };
}

// Define a type for the patient data structure
interface Patient {
  id: string;
  age: number;
  sex: string;
  capFeatures: string[];
  contraindications: string[];
  icuTimings: string[];
  consent: string;
  clinicalState: string[];
  eligibility: {
    status: "Eligible" | "Pending";
    dateScreened: string;
    reason: string;
  };
}

/**
 * Fetches patient data from the API with comprehensive error handling
 * @param id - The patient ID to fetch
 * @returns Promise<Patient | null> - Returns patient data or null if not found/failed
 */
async function getPatient(id: string): Promise<Patient | null> {
  try {
    // Validate input
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('Invalid patient ID provided:', id);
      return null;
    }

    const res = await fetch(
      `${API_BASE_URL}/api/patient/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for better error handling
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );

    // Handle HTTP errors with more specific error messages
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP error! status: ${res.status}`;
      console.error(`Failed to fetch patient ${id}:`, errorMessage);
      return null;
    }

    const patientData = await res.json();
    
    // Validate the response structure
    if (!patientData || typeof patientData !== 'object') {
      console.error('Invalid patient data received for ID:', id);
      return null;
    }

    return patientData as Patient;
  } catch (error) {
    // Handle network errors, timeouts, and other exceptions
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`Request timeout for patient ${id}`);
      } else {
        console.error(`Network error fetching patient ${id}:`, error.message);
      }
    } else {
      console.error(`Unexpected error fetching patient ${id}:`, error);
    }
    return null;
  }
}

/**
 * Patient detail page component that displays patient information
 * @param params - URL parameters containing patient_id
 */
export default async function PatientDetail({ params }: PatientDetailProps) {
  const { patient_id } = await params;
  
  // Fetch patient data with error handling
  const patient = await getPatient(patient_id);

  // Enhanced error handling with user-friendly messages
  if (!patient) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Patient Not Found</h2>
          <p className="text-red-600">
            Unable to find patient with ID: <span className="font-mono bg-red-100 px-2 py-1 rounded">{patient_id}</span>
          </p>
          <p className="text-red-500 text-sm mt-2">
            This could be due to an invalid ID, network issues, or the patient may not exist in the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PatientDetailPage patient={patient} />
    </div>
  );
}
