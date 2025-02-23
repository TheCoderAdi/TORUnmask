"use client";

import { useState } from "react";
import { features } from "@/constant/data";
import { useRouter } from "next/navigation";
import { featureNames } from "@/constant/data";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function LandingPage() {
  const router = useRouter();

  const [featureImportance] = useState([
    0.1825, 0.1041, 0.0973, 0.097, 0.0768, 0.0741, 0.0475, 0.0425, 0.0424,
    0.0418, 0.0414, 0.04, 0.0375, 0.0362, 0.0291,
  ]);
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-gray-900 p-6">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

      <h1 className="text-5xl font-extrabold text-center mb-6">
        AI-Powered TOR Traffic Detection 🚀
      </h1>

      <p className="text-lg text-center max-w-2xl text-gray-700 mb-8">
        Our AI model detects if network traffic belongs to the TOR network by
        analyzing <b>15</b>key network features. You can either **upload a
        file** or manually input the data for detection.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-5 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <h3 className="font-bold text-lg">{feature.name}</h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 w-full max-w-2xl text-gray-500 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">Feature Importance</h2>
        <Bar
          data={{
            labels: featureNames,
            datasets: [
              {
                label: "Importance",
                data: featureImportance,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: { ticks: { color: "black" } },
              y: { ticks: { color: "black" } },
            },
          }}
        />
      </div>

      <div className="mt-12 p-6 bg-gray-100 border border-gray-300 rounded-lg max-w-3xl text-center shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          How to Get These Features? 🛠
        </h2>
        <p className="text-lg text-gray-700">
          You can upload a PCAP or CSV file directly, and our system will
          extract the required features automatically. Alternatively, use
          <b> Wireshark</b> or <b>NetFlow</b> logs to capture network packets.
        </p>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          onClick={() => router.push("/predict")}
          className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-600 hover:shadow-lg transition"
        >
          Start Detection 🚀
        </button>
        <button
          onClick={() => router.push("/upload")}
          className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg shadow hover:bg-green-600 hover:shadow-lg transition"
        >
          Upload File 📁
        </button>
      </div>
    </div>
  );
}
