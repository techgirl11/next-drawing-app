"use client";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Konva from "konva";

const LoadDrawing = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { selectedDrawing } = useSelector((state) => state.userDrawings);

  useEffect(() => {
    Konva.Node.create(selectedDrawing.jsonData, "drawingContainer");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-4">
        <div className="text-right">
          <h1 className="text-base">
            Welcome,{" "}
            <span className="text-indigo-500 text-s">{user.email}</span>
          </h1>
          <button
            type="button"
            onClick={() => router.push("/logout")}
            className="px-4 py-2 text-white
              bg-red-400 rounded-md
              hover:bg-red-500 focus:outline-none
              focus:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 text-white text-right
              bg-indigo-500 rounded-md
              hover:bg-indigo-600 focus:outline-none
              focus:bg-indigo-700"
          >
            Back to dashboard
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-6">
          Drawing:{" "}
          <span className="text-indigo-500">{selectedDrawing.name}</span>
        </h1>
        <div id="drawingContainer"></div>
      </div>
    </div>
  );
};

export default LoadDrawing;
