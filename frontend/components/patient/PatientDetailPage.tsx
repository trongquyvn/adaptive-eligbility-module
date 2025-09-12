"use client";

import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { usePatients } from "@/context/PatientContext";
import PatientInfo from "./PatientInfo";
import { useToast } from "@/context/ToastContext";
import { Pencil } from "lucide-react";
import CreatePatientDialog from "./CreatePatientDialog";
import { collectInputVars, flattenObj, isoToLocalInput } from "@/lib/common";
import { updatePatient } from "@/lib/patient";

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center p-1 text-gray-500 hover:text-purple-600"
    >
      <Pencil className="w-6 h-6" />
    </button>
  );
}

function StatusTag({ value }: { value: any }) {
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
      {value}
    </span>
  );
}

const items = [
  {
    href: "/patient",
    label: "Patient List",
  },
  {
    label: "Patient Details",
  },
];

function countPrefix(arr: string[], prefix: string): number {
  return arr.filter((s) => s.startsWith(prefix)).length;
}

export default function PatientDetailPage({ patient }: any) {
  const { rule, updateActivePatient, activeDataKey } = usePatients();
  const variables = rule?.variables || [];
  const inputVars = collectInputVars(rule);
  const variablesPatient = variables.filter((e: any) =>
    inputVars.includes(e.id)
  );

  const { eligibility = {}, jurisdiction } = patient;

  const data = patient?.data?.[activeDataKey] || {};
  const eligibilityRule = eligibility[activeDataKey] || {};

  const [isOpen, setIsOpen] = useState(false);
  const [isCreatePatientModalOpen, setIsCreatePatientModalOpen] =
    useState(false);
  const { showToast } = useToast();

  const onRun = () => {
    if (eligibilityRule?.isDraft) {
      showToast("This is draft patient, please input full data", "error");
    }
    console.log(">>>>>>>>>>");
  };

  const handleCreate = async (patientData: any) => {
    const jurisdiction = patientData.jurisdiction;
    delete patientData.jurisdiction;
    const newPatient: any = {
      jurisdiction,
      data: {
        ...patient.data,
        [activeDataKey]: patientData,
      },
      eligibility: {
        ...patient.eligibility,
        isDraft: false,
      },
    };

    const result = await updatePatient(patient.patient_id, newPatient);
    if (result) {
      updateActivePatient(result);
      showToast("Patient is updated", "success");
    }
  };

  const initForm: any = {};
  const flattenData = flattenObj(data);
  const keys = Object.keys(flattenData || {});
  keys.forEach((k) => {
    const varK = variables.find((e: any) => e.id === k);
    if (varK.type === "TIME_WINDOW") {
      initForm[k] = isoToLocalInput(flattenData[k]);
    } else {
      if (varK.type === "BOOLEAN") {
        const prefix = k.includes(".") ? k.split(".")[0] : k;
        const count = countPrefix(keys, `${prefix}.`);
        if (count > 1) {
          if (!initForm[prefix]) initForm[prefix] = [];
          if (flattenData[k]) {
            initForm[prefix].push(varK.name);
          }
        } else {
          initForm[k] = flattenData[k];
        }
      } else {
        initForm[k] = flattenData[k];
      }
    }
  });
  initForm.jurisdiction = jurisdiction;

  return (
    <div>
      <CreatePatientDialog
        isOpen={isCreatePatientModalOpen}
        onClose={() => {
          setIsCreatePatientModalOpen(false);
        }}
        onCreatePatient={handleCreate}
        initForm={initForm}
      />

      <div className="flex justify-between">
        <Breadcrumb items={items} />

        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          onClick={() => {
            onRun();
          }}
        >
          Run Eligibility
        </button>
      </div>
      <div className="flex justify-between items-start mb-4 mt-4">
        <div className="text-lg font-semibold text-gray-900">
          {patient?.patient_id}
          <span className="text-xs">
            {" "}
            {rule?.trial?.id} - {rule?.trial?.version}
          </span>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-5">
        {/* Header */}
        <div className="flex justify-between items-start border-b-1 border-solid pb-4">
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
        <div className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="border-r-1 border-solid flex justify-between items-start">
              <PatientInfo patientData={data} variables={variablesPatient} />
              <EditButton
                onClick={() => {
                  setIsCreatePatientModalOpen(true);
                }}
              />
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Eligibility Result
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <StatusTag value={eligibilityRule?.status || "Pending"} />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Date Screened:
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  {eligibilityRule?.dateScreened}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Reason:
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {eligibilityRule?.reason}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* JSON Output Section */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Machine-Readable JSON Output:
            </h3>
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Inactive</span>
              <div className="relative inline-block w-10 h-6 bg-gray-300 rounded-full">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
              </div>
            </div> */}
          </div>
          <div className="relative">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 font-mono">
                  Patient JSON data
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
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsOpen(true)}
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
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <pre className="text-xs font-mono text-gray-700 overflow-x-auto max-h-50">
                {JSON.stringify(data, null, 2)}
              </pre>
              {isOpen && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg w-11/12 max-w-3xl p-6 relative">
                    <h2 className="text-lg font-bold mb-4">Patient JSON</h2>
                    <pre className="max-h-90 overflow-auto bg-gray-100 p-4 rounded">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
