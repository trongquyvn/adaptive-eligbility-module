"use client";

interface PatientDetailPageProps {
  patient: {
    id: string;
    age: number;
    sex: string;
    capFeatures: string[];
    contraindications: string[];
    icuTimings: string[];
    consent: string;
    clinicalState: string[];
    eligibility: {
      status: "Eligible" | "Ineligible" | "Pending";
      dateScreened: string;
      reason: string;
    };
  };
}

export default function PatientDetailPage({ patient }: PatientDetailPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            Patient information and eligibility results
          </p>
        </div>
        <a
          href="#"
          className="text-sm text-purple-600 hover:underline flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          History Log
        </a>
      </div>

      {/* Patient Details Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div className="text-lg font-semibold text-gray-900">
            Patient #{patient.id}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-4 grid grid-cols-2 xs:grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Demographics:
                </h3>
                <p className="text-sm text-gray-600">
                  Age: {patient.age} | Sex: {patient.sex}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  CAP Features:
                </h3>
                <p className="text-sm text-gray-600">
                  {patient.capFeatures.join(", ")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Contraindications:
                </h3>
                <p className="text-sm text-gray-600">
                  {patient.contraindications.join(", ")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  ICU Timings:
                </h3>
                <p className="text-sm text-gray-600">
                  {patient.icuTimings.join(", ")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Consent:
                </h3>
                <p className="text-sm text-gray-600">{patient.consent}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Clinical State:
                </h3>
                <p className="text-sm text-gray-600">
                  {patient.clinicalState.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Eligibility Result
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${
                  patient.eligibility.status === "Eligible"
                    ? "bg-green-500 text-white"
                    : patient.eligibility.status === "Ineligible"
                    ? "bg-red-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    patient.eligibility.status === "Eligible"
                      ? "bg-white"
                      : patient.eligibility.status === "Ineligible"
                      ? "bg-white"
                      : "bg-white"
                  }`}
                />
                {patient.eligibility.status}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Date Screened:
              </span>
              <span className="text-sm text-gray-600 ml-2">
                {patient.eligibility.dateScreened}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Reason:</span>
              <p className="text-sm text-gray-600 mt-1">
                {patient.eligibility.reason}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Output Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Machine-Readable JSON Output:
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Inactive</span>
            <div className="relative inline-block w-10 h-6 bg-gray-300 rounded-full">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 font-mono">
                JSON Response
              </span>
              <div className="flex gap-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
              {`{
  "patient_id": "${patient.id}",
  "eligibility": {
    "status": "${patient.eligibility.status}",
    "date_screened": "${patient.eligibility.dateScreened}",
    "reason": "${patient.eligibility.reason}"
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
