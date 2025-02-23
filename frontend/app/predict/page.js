"use client";

import { useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { featureNames } from "@/constant/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PredictPage() {
  const defaultValues = [
    4953923, 299578.132320587, 362.5409599624, 2759.8456824513, 8259.8475578591,
    100335, 2, 4114.553986711, 10335.1164035642, 100550, 3, 8394.2983050848,
    14501.1584027353, 100651, 46,
  ];

  const [features, setFeatures] = useState(Array(15).fill(""));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const fillDefaultValues = () => {
    setFeatures([...defaultValues]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (features.some((val) => val === "")) {
        setResult({ error: "Please fill all the fields" });
        return;
      }
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        features: features.map(Number),
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to get a response" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-gray-900 p-6">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      <h1 className="text-4xl font-bold mb-6">TOR Traffic Detection 🚀</h1>

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-lg bg-white border border-gray-200 w-full max-w-3xl"
      >
        <div className="grid grid-cols-4 gap-4">
          {features.map((val, index) => (
            <input
              key={index}
              type="text"
              placeholder={featureNames[index]}
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              className="p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={fillDefaultValues}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Use Default Values
          </button>
          <button
            disabled={loading}
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-10 flex flex-col items-center bg-white border border-gray-300 shadow-md rounded-lg w-full max-w-md p-6 text-center">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <p className="text-lg font-semibold">
                Prediction:{" "}
                <span
                  className={
                    result.prediction === "Tor"
                      ? "text-red-600 font-bold"
                      : "text-green-600 font-bold"
                  }
                >
                  {result.prediction}
                </span>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
