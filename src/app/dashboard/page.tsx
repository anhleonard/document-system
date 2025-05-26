"use client";
import React, { useState } from "react";
import FileInput from "@/components/dashboard/FileInput";
import Button from "@/lib/button";
import Tabs from "@/lib/tabs";
import FieldsExtractionResults from "@/components/dashboard/FieldsExtractionResults";
import ProductsSupplierResults from "@/components/dashboard/ProductsSupplierResults";
import { extractFields, extractSuppliers } from "@/apis/services/dashboard";

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
}

interface Product {
  sheet_name: string;
  product_name: string;
  technical_requirements: string;
  confidence_score: number;
  reason: string;
  supplier_search: {
    status: string;
    suppliers: Array<{
      link: string;
      seller: string;
      specs: string;
    }>;
    search_reason: string;
  };
}

interface ProductsResponse {
  products: Product[];
}

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractionResults, setExtractionResults] = useState<ExtractionResponse | null>(null);
  const [productsResults, setProductsResults] = useState<ProductsResponse | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setUploadError(null);
    setExtractionResults(null);
    setProductsResults(null);
  };

  const handleExtractFields = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await extractFields({ file: selectedFile });
      setExtractionResults(response);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExtractProducts = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await extractSuppliers({ file: selectedFile });
      setProductsResults(response);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadError(null);
    setIsUploading(false);
    setExtractionResults(null);
    setProductsResults(null);
  };

  const tabs = [
    {
      id: "fields",
      label: "Fields Extraction Results",
      content: <FieldsExtractionResults results={extractionResults} />,
    },
    {
      id: "products",
      label: "Products & Supplier Results",
      content: <ProductsSupplierResults results={productsResults} />,
    },
  ];

  return (
    <div className="w-full h-full text-grey-c900 text-base max-w-screen-md mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mt-2">Document Processing System</h1>
      </div>
      <div className="flex flex-col gap-4">
        <FileInput
          value={selectedFile}
          onChange={handleFileChange}
          error={!!uploadError}
          helperText={uploadError || ""}
          disabled={isUploading}
        />
        <div className="grid grid-cols-3 gap-8">
          <Button
            className="w-full py-3"
            label={isUploading ? "Uploading..." : "Extract Fields"}
            onClick={handleExtractFields}
            disabled={isUploading || !selectedFile}
          />
          <Button
            className="w-full py-3"
            label={isUploading ? "Uploading..." : "Extract Products & Suppliers"}
            onClick={handleExtractProducts}
            disabled={isUploading || !selectedFile}
          />
          <Button className="w-full py-3" label="Reset" onClick={handleReset} disabled={isUploading} />
        </div>
        <div className="mt-6 mb-12">
          <Tabs tabs={tabs} defaultTab="fields" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
