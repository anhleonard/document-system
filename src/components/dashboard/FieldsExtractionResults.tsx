import Image from "next/image";
import React from "react";

interface ExtractionField {
  value: string | null;
  source_excerpt: string | null;
  confidence_score: number;
}

interface ExtractionResponse {
  funding_budget: ExtractionField;
  pre_bid_date: ExtractionField;
  bid_security: ExtractionField;
  payment_method: ExtractionField;
  _field_conflicts?: Record<string, unknown>;
  _processing_metadata?: Record<string, unknown>;
}

interface FieldsExtractionResultsProps {
  results: ExtractionResponse | null;
}

const formatFieldName = (fieldName: string): string => {
  return fieldName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const FieldsExtractionResults = ({ results }: FieldsExtractionResultsProps) => {
  const renderField = (fieldName: keyof ExtractionResponse, field: ExtractionField) => (
    <div key={fieldName} className="flex flex-col gap-4 border-t border-grey-c200 pt-4">
      <div className="text-grey-c700 font-bold text-sm pl-2">{formatFieldName(fieldName)}</div>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <label className="absolute -top-1 left-2 px-1 bg-gradient-to-b from-primary-c50 to-white text-primary-c900 text-xs font-medium">
            Value
          </label>
          <div className="border border-primary-c900 rounded-xl px-4 py-2.5 bg-white min-h-[40px] mt-1">
            {field.value || "--"}
          </div>
        </div>
        <div className="relative">
          <label className="absolute -top-1 left-2 px-1 bg-gradient-to-b from-primary-c50 to-white text-primary-c900 text-xs font-medium">
            Source Excerpt
          </label>
          <div className="border border-primary-c900 rounded-xl px-4 py-2.5 bg-white min-h-[40px] mt-1">
            {field.source_excerpt || "--"}
          </div>
        </div>
        <div className="relative">
          <label className="absolute -top-1 left-2 px-1 bg-gradient-to-b from-primary-c50 to-white text-primary-c900 text-xs font-medium">
            Confidence Score (0-100)
          </label>
          <div className="border border-primary-c900 rounded-xl px-4 py-2.5 bg-white min-h-[40px] mt-1">
            {field.confidence_score ? `${field.confidence_score}%` : "--"}
          </div>
        </div>
      </div>
    </div>
  );

  const filteredResults = results ? Object.entries(results).filter(([fieldName]) => !fieldName.startsWith("_")) : [];

  return (
    <div className={`flex flex-col gap-4 ${!results ? "h-[calc(100vh-300px)]" : ""}`}>
      {/* 1. Processing Status */}
      <div className="bg-primary-c50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-grey-c800 font-bold text-base mb-3 pl-2">
          <Image src="/icons/setting-icon.svg" alt="setting-icon" width={18} height={18} />
          Processing status
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative">
            <label className="absolute -top-1 left-2 px-1 bg-gradient-to-b from-primary-c50 to-white text-primary-c900 text-xs font-medium">
              Status
            </label>
            <div className="border border-primary-c900 rounded-xl px-4 py-2.5 bg-white min-h-[40px] mt-1">
              {results ? "Processing completed" : "No file processed yet"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Extracted Fields */}
      <div className={`bg-primary-c50 rounded-lg p-4 ${!results ? "flex-1" : ""}`}>
        <div className="flex items-center gap-2 text-grey-c800 font-bold text-base mb-3 pl-2">
          <Image src="/icons/setting-icon.svg" alt="setting-icon" width={18} height={18} />
          Extracted fields
        </div>
        {filteredResults.length > 0 ? (
          <div className="flex flex-col gap-4 overflow-y-auto">
            {filteredResults.map(([fieldName, field]) =>
              renderField(fieldName as keyof ExtractionResponse, field as ExtractionField),
            )}
          </div>
        ) : (
          <div className={`flex-1 flex justify-center text-grey-c400 text-center py-4 ${!results ? "h-full" : ""}`}>
            Upload a file and click &quot;Extract Fields&quot; to see results
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsExtractionResults;
