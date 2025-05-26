import axios from "axios";

const API_DOMAIN = process.env.NEXT_PUBLIC_HTTP_API_DOMAIN;

export const extractFields = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_DOMAIN}/extract-fields?batch_size=12`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      throw error.response.data;
    }
    if (error instanceof Error) {
      throw error.message;
    }
    throw "An unknown error occurred";
  }
};

export const extractSuppliers = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_DOMAIN}/extract-suppliers?top_k=5`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      throw error.response.data;
    }
    if (error instanceof Error) {
      throw error.message;
    }
    throw "An unknown error occurred";
  }
};
