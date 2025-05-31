import Image from "next/image";
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface Supplier {
  link: string;
  seller: string;
  specs: string;
  price: string;
}

interface SupplierSearch {
  status: string;
  suppliers: Supplier[];
  search_reason: string;
}

interface Product {
  product_name: string;
  technical_requirements: string;
  confidence_score: number;
  reason: string;
  supplier_search: SupplierSearch;
}

interface ProductsSupplierResultsProps {
  results: { products: Product[] } | null;
}

const ProductsSupplierResults = ({ results }: ProductsSupplierResultsProps) => {
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());

  const toggleProduct = (index: number) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const renderProduct = (product: Product, index: number) => {
    const isExpanded = expandedProducts.has(index);

    const productContent = (
      <>
        <button
          onClick={() => toggleProduct(index)}
          className="flex items-center justify-between w-full text-left hover:bg-primary-c100 rounded-lg p-2 transition-colors"
        >
          <div className="flex items-center gap-2 text-grey-c800 font-bold text-base">
            <Image src="/icons/setting-icon.svg" alt="setting-icon" width={18} height={18} />
            {product.product_name}
          </div>
          {isExpanded ? (
            <FiChevronUp className="w-6 h-6 text-grey-c600" />
          ) : (
            <FiChevronDown className="w-6 h-6 text-grey-c600" />
          )}
        </button>

        <div
          className={`flex flex-col gap-4 bg-white rounded-xl px-3 py-4 transition-all duration-300 ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-1 pl-4">
            <div className="flex items-center gap-1">
              <Image src="/icons/class-icon.svg" alt="class-icon" width={14} height={14} />
              <div className="text-grey-c700 font-bold text-xs">Technical requirements</div>
            </div>
            <div className="text-grey-c900 font-normal text-base pl-4 whitespace-pre-line">
              {product.technical_requirements || "--"}
            </div>
          </div>
          {/* <div className="flex flex-col gap-1 pl-4">
            <div className="flex items-center gap-1">
              <Image src="/icons/class-icon.svg" alt="class-icon" width={14} height={14} />
              <div className="text-grey-c700 font-bold text-xs">Confidence score</div>
            </div>
            <div className="text-grey-c700 font-normal text-base pl-4">{product.confidence_score}%</div>
          </div> */}
        </div>

        {/* Suppliers */}
        <div className={`flex flex-col gap-4 transition-all duration-300 ${isExpanded ? "block" : "hidden"}`}>
          {product.supplier_search.suppliers.length > 0 ? (
            <div className="font-bold text-sm pl-2 mt-2 bg-primary-c900 text-white px-2 py-1 rounded-lg w-fit">
              Supplier list
            </div>
          ) : null}
          {product.supplier_search.suppliers.map((supplier, supplierIndex) => (
            <div key={`${index}-${supplierIndex}`} className="flex flex-col gap-4">
              <div className="text-grey-c700 font-bold text-sm pl-2">
                {supplierIndex + 1}. {supplier.seller}
              </div>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <label className="absolute -top-1 left-2 px-1 bg-gradient-to-b from-primary-c50 to-white text-primary-c900 text-xs font-medium">
                    Specs
                  </label>
                  <div className="text-grey-c900 border border-primary-c900 rounded-xl px-4 py-2.5 bg-white min-h-[40px] mt-1 whitespace-pre-line">
                    {supplier.specs}
                  </div>
                </div>
                <div className="relative">
                  <label className="absolute -top-1 left-2 px-1 bg-gradient-to-b from-primary-c50 to-white text-primary-c900 text-xs font-medium">
                    Link
                  </label>
                  <a
                    href={supplier.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-primary-c900 rounded-xl px-4 py-2.5 bg-white min-h-[40px] mt-1 block text-primary-c900 hover:bg-primary-c50 transition-colors truncate max-w-full overflow-hidden"
                    title={supplier.link}
                  >
                    {supplier.link}
                  </a>
                </div>
                {supplier.price ? (
                  <div className="relative">
                    <label className="absolute -top-1 left-2 px-1 bg-gradient-to-b from-primary-c50 to-white text-primary-c900 text-xs font-medium">
                      Price
                    </label>
                    <div className="border border-primary-c900 rounded-xl px-4 py-2.5 bg-white min-h-[40px] mt-1">
                      {supplier.price}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </>
    );

    return (
      <div key={index} className="bg-primary-c50 rounded-lg p-4 flex flex-col gap-2 mb-4">
        {productContent}
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-4 ${!results?.products ? "h-[calc(100vh-300px)]" : ""}`}>
      {results?.products ? (
        <div className="flex flex-col gap-4 overflow-y-auto">
          {results.products.map((product, index) => renderProduct(product, index))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-grey-c400 text-center py-4">
          Upload a file and click &quot;Extract Products &amp; Suppliers&quot; to see results
        </div>
      )}
    </div>
  );
};

export default ProductsSupplierResults;
