"use client";
import React from "react";
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const LoadDrawing = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { selectedDrawing } = useSelector((state) => state.userDrawings);
  const stageRef = React.useRef(null);
  const drawingNameRef = React.useRef(null);

  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);

  useEffect(() => {
    const container = document.getElementById('drawingContainer');
    Konva.Node.create(selectedDrawing.jsonData, 'drawingContainer');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-semibold text-center mb-6">Loaded drawing - <span className="text-indigo-500">{selectedDrawing.name}</span></h1>

        <div id="drawingContainer"></div>
        
        <button
          type="submit"
          onClick={() => router.push("/dashboard")}
          className="w-full px-4 py-2 text-white
              bg-indigo-500 rounded-md
              hover:bg-indigo-600 focus:outline-none
              focus:bg-indigo-700"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
};

export default LoadDrawing;
