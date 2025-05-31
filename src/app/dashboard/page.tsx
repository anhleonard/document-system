"use client";
import React, { useState } from "react";
import FileInput from "@/components/dashboard/FileInput";
import Button from "@/lib/button";
import Tabs from "@/lib/tabs";
import FieldsExtractionResults from "@/components/dashboard/FieldsExtractionResults";
import ProductsSupplierResults from "@/components/dashboard/ProductsSupplierResults";
import { extractFields, extractSuppliers } from "@/apis/services/dashboard";
import { useDispatch } from "react-redux";
import { openLoading, closeLoading } from "@/redux/slices/loading-slice";
import { openAlert } from "@/redux/slices/alert-slice";

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
      price: string;
    }>;
    search_reason: string;
  };
}

interface ProductsResponse {
  products: Product[];
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    dispatch(openLoading());
    setUploadError(null);

    try {
      const response = await extractFields({ file: selectedFile });
      if (response) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "SUCCESS",
            subtitle: "Extract fields successfully",
            type: "success",
          }),
        );
      }
      setExtractionResults(response);
    } catch (error) {
      dispatch(
        openAlert({
          isOpen: true,
          title: "ERROR",
          subtitle: error instanceof Error ? error.message : "Failed to extract fields",
          type: "error",
        }),
      );
      setUploadError(error instanceof Error ? error.message : "Failed to process file");
    } finally {
      dispatch(closeLoading());
    }
  };

  const handleExtractProducts = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first");
      return;
    }

    dispatch(openLoading());
    setUploadError(null);

    try {
      const response = await extractSuppliers({ file: selectedFile });
      if (response) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "SUCCESS",
            subtitle: "Find suppliers successfully",
            type: "success",
          }),
        );
      }
      setProductsResults(response);
    } catch (error) {
      dispatch(
        openAlert({
          isOpen: true,
          title: "ERROR",
          subtitle: error instanceof Error ? error.message : "Failed to find suppliers",
          type: "error",
        }),
      );
      setUploadError(error instanceof Error ? error.message : "Failed to process file");
    } finally {
      dispatch(closeLoading());
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadError(null);
    dispatch(closeLoading());
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
    <div className="w-full h-full text-grey-c900 text-base max-w-screen-md xl:max-w-screen-lg mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mt-2">Document Processing System</h1>
      </div>
      <div className="flex flex-col gap-4">
        <FileInput
          value={selectedFile}
          onChange={handleFileChange}
          error={!!uploadError}
          helperText={uploadError || ""}
          disabled={false}
        />
        <div className="grid grid-cols-3 gap-8">
          <Button
            className="w-full py-3"
            label="Extract Fields"
            onClick={handleExtractFields}
            disabled={!selectedFile}
          />
          <Button
            className="w-full py-3"
            label="Extract Products & Suppliers"
            onClick={handleExtractProducts}
            disabled={!selectedFile}
          />
          <Button className="w-full py-3" label="Reset" onClick={handleReset} />
        </div>
        <div className="mt-6 mb-12">
          <Tabs tabs={tabs} defaultTab="fields" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
