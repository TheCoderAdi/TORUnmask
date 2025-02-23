"use client";

import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict-file",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to get a response" });
    }
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-gray-900 p-6">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      <h1 className="text-4xl font-bold mb-6">
        Upload Network Traffic Data 🚀
      </h1>

      <div className="p-6 rounded-lg shadow-lg bg-white border border-gray-200 w-full max-w-3xl text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-lg text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload and Predict"}
        </button>
      </div>

      {result && (
        <div className="mt-10 flex flex-col items-center bg-white border border-gray-300 shadow-md rounded-lg w-full max-w-lg p-6 text-center">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
              <div className="w-full text-left">
                {result.predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="p-3 border-b border-gray-300 last:border-b-0"
                  >
                    <p>
                      <strong>Row {index + 1}:</strong>{" "}
                      <span
                        className={
                          prediction === "Tor"
                            ? "text-red-600 font-bold"
                            : "text-green-600 font-bold"
                        }
                      >
                        {prediction}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
