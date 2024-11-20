import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Stage, Layer, Line } from "react-konva";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import { logout } from "../redux/slices/authSlice";

/**
 * NewDrawing component
 *
 * Renders a page for creating a new drawing.
 * Allows the user to draw on the canvas and save drawing.
 *
 * @returns {React.ReactElement} The rendered new drawing page component
 */
const NewDrawing = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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

  /**
   * Handles saving a new drawing to the server
   *
   * Post the data to /api/save endpoint 
   *
   * @param {Event} e The button click event
   */
  const handleSaveDrawing = async (e) => {
    e.preventDefault();
    const userId = user.uid;
    const drawingName = drawingNameRef.current.value;
    const stage = stageRef.current;
    const drawingData = stage.toJSON();

    if (drawingName.trim() === "") {
      alert("Please enter a drawing name");
      return;
    }

    await fetch("http://localhost:3000/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, drawingName, drawingData }),
    })
      .then((res) => res.json())
      .then((data) => router.push("/dashboard"))
      .catch((error) => console.error(error));
  };

  /**
   * Logs out the current user from the application.
   */
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) {
    return <div>Redirecting...</div>;
  }

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
            onClick={handleLogout}
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
        <h1 className="text-2xl font-semibold text-center mb-6">New drawing</h1>

        <div className="w-full flex">
          <label className="w-min sm:w-1/4 pt-2">Select a tool: </label>
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
        </div>
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
          maxLength={20}
          className="w-full px-4 py-2 border
              border-gray-300 rounded-md
              focus:outline-none focus:ring-2
              focus:ring-indigo-500"
          placeholder="Name your drawing"
          required
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
      </div>
    </div>
  );
};

export default NewDrawing;
