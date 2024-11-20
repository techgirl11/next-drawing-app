"use client";
import React from "react";
import { useSelector } from "react-redux";
import { Stage, Layer, Line } from "react-konva";
import { useRouter } from "next/router";

const NewDrawing = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const stageRef = React.useRef(null);
  const drawingNameRef = React.useRef(null);

  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleSaveDrawing = async () => {
    const userId = user.uid;
    const drawingName = drawingNameRef.current.value;
    const stage = stageRef.current;
    const drawingData = stage.toJSON();

    await fetch("http://localhost:3000/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, drawingName, drawingData }),
    })
      .then((res) => res.json())
      .then((data) => router.push("/dashboard"))
      .catch((error) => console.error(error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-semibold text-center mb-6">New canvas</h1>

        <select
          className="w-full px-4 py-2 border
             border-gray-300 rounded-md
             focus:outline-none focus:ring-2
             focus:ring-indigo-500"
          value={tool}
          onChange={(e) => {
            setTool(e.target.value);
          }}
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
        </select>

        <div id="drawingContainer"></div>
        <Stage
          width={624}
          height={400}
          ref={stageRef}
          container="drawingContainer"
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
        <input
          type="text"
          ref={drawingNameRef}
          className="w-full px-4 py-2 border
              border-gray-300 rounded-md
              focus:outline-none focus:ring-2
              focus:ring-indigo-500"
          placeholder="Name your drawing"
          required={true}
        />
        <button
          type="submit"
          onClick={handleSaveDrawing}
          className="w-full px-4 py-2 text-white
              bg-indigo-500 rounded-md
              hover:bg-indigo-600 focus:outline-none
              focus:bg-indigo-700"
        >
          Save
        </button>
        <button
          type="button"
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

export default NewDrawing;
