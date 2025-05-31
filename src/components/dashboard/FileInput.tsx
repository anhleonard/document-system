"use client";
import { useState, useRef } from "react";
import { FiUpload, FiX } from "react-icons/fi";

interface FileInputProps {
  label?: string;
  onChange?: (file: File | null) => void;
  className?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  value?: File | null;
  accept?: string;
  maxSize?: number; // in MB
}

const FileInput = ({
  onChange,
  className = "",
  error = false,
  helperText = "",
  disabled = false,
  value,
  accept = ".pdf,.xlsx,.xls,.doc,.docx",
  maxSize = 100, // 100MB default
}: FileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Use controlled value if provided, otherwise use internal state
  const displayFile = value ?? internalFile;

  const handleFileChange = (file: File | null) => {
    setValidationError(""); // Reset error when new file is selected

    if (file) {
      // Validate file type
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = accept.split(",").map((ext) => ext.replace(".", ""));

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        setValidationError(`Invalid file format. Allowed formats: ${accept.replace(/\./g, "")}`);
        if (onChange) onChange(null);
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setValidationError(`File size exceeds the maximum limit (${maxSize}MB)`);
        if (onChange) onChange(null);
        return;
      }
    }

    setInternalFile(file);
    if (onChange) onChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "xlsx":
      case "xls":
        return "📊";
      case "doc":
      case "docx":
        return "📝";
      default:
        return "📎";
    }
  };

  return (
    <div className={`w-full ${className} mt-4`}>
      <div
        ref={dropZoneRef}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-[20px] p-4 transition-all cursor-pointer
          ${isDragging ? "border-primary-c900 bg-primary-c50" : ""}
          ${error ? "border-support-c100 bg-support-c10" : "border-grey-c200"}
          ${!disabled && !error ? "hover:border-primary-c300" : ""}
          ${disabled ? "bg-grey-c100/80 cursor-not-allowed" : ""}
          ${isFocused && !error ? "border-primary-c900" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {!displayFile ? (
          <div className="flex flex-col items-center justify-center text-center">
            <FiUpload className={`w-8 h-8 mb-2 ${error ? "text-support-c100" : "text-grey-c400"}`} />
            <p className={`text-sm ${error ? "text-support-c100" : "text-grey-c400"}`}>
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-grey-c300 mt-1">Supported formats: PDF, Excel, Word (Max {maxSize}MB)</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getFileIcon(displayFile.name)}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-grey-c900 truncate max-w-[200px]">{displayFile.name}</span>
                <span className="text-xs text-grey-c400">{(displayFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
            {!disabled && (
              <button onClick={handleRemoveFile} className="p-1 hover:bg-grey-c100 rounded-full transition-colors">
                <FiX className="w-5 h-5 text-grey-c400" />
              </button>
            )}
          </div>
        )}
      </div>

      {helperText && <p className={`text-xs mt-1 ${error ? "text-support-c100" : "text-grey-c400"}`}>{helperText}</p>}
      {validationError && <p className="text-xs mt-1 text-support-c500">{validationError}</p>}
    </div>
  );
};

export default FileInput;
