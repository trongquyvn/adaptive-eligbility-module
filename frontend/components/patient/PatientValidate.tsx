"use client";

import { usePatients } from "@/context/PatientContext";
import { formatISODate, statusStyle } from "@/lib/common";
import { useEffect, useState } from "react";

const steps = ["ID Check", "Platform", "Domain", "Regimen", "Consent"];

export default function PatientValidate({
  patient,
  isRunning,
  endNum,
  isOnPass,
}: any) {
  const { activeDataKey } = usePatients();
  const [activeStep, setActiveStep] = useState(0);

  const { eligibility = {} } = patient;
  const eligibilityRule = eligibility[activeDataKey] || {};

  useEffect(() => {
    if (isRunning) {
      if (typeof endNum === "number") {
        const interval = setInterval(() => {
          setActiveStep((prev) =>
            prev < steps.length - 1 && prev < endNum ? prev + 1 : prev
          );
        }, 500);
        return () => clearInterval(interval);
      }
    } else {
      setActiveStep(0);
    }
  }, [isRunning, endNum]);

  const getStyles = () => {
    if (!eligibilityRule?.status) {
      return statusStyle["Pending"];
    }
    return statusStyle[isOnPass ? "Eligible" : "Ineligible"];
  };

  return (
    <>
      {isRunning ? (
        <>
          <h2 className="text-xl font-semibold text-gray-800 text-left">
            Eligibility Result...
          </h2>
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Loader */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-800">
                Validating Patient Eligibility
              </p>
              <p className="text-sm text-gray-500">
                Please wait while we verify the required information.
              </p>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-3 text-sm">
              {steps.map((step, idx) => {
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className={
                        idx <= activeStep
                          ? activeStep === endNum - 1 &&
                            idx + 1 === endNum &&
                            !isOnPass
                            ? "text-red-600 font-medium"
                            : "text-green-600 font-medium"
                          : "text-gray-600"
                      }
                    >
                      {step}
                    </span>
                    {idx < steps.length - 1 && (
                      <span className="text-gray-400">••</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Eligibility Result
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className={`px-3 py-1 rounded-full ${getStyles()}`}>
              {eligibilityRule?.status || "Pending"}
            </span>
          </div>

          {eligibilityRule && eligibilityRule?.status && (
            <>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Registry code
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  {eligibilityRule?.registry_code}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Date Screened:
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  {formatISODate(eligibilityRule?.evaluated_at)}
                </span>
              </div>
              {!!(
                eligibilityRule?.key_reasons &&
                eligibilityRule?.key_reasons.length
              ) && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Reason:
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {eligibilityRule?.key_reasons}
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
