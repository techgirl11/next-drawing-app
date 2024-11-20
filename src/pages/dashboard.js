import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { setLoading, setError, setSelectedDrawing } from "../redux/slices/drawingSlice";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [userDrawings, setUserDrawings] = useState([]);
  const { loading, error } = useSelector((state) => state.userDrawings);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return null;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/list?userId=${user.uid}`);

        if (res.ok) {
          const data = await res.json();
          setUserDrawings(data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = async () => {
    const auth = getAuth();
    signOut(auth);
    dispatch(logout());
    router.push("/login");
  };

  const handleLoadDrawing = async (e) => {
    const currentDrawing = JSON.parse(e.target.getAttribute("data-drawing"));
    const drawingData = {
      id: currentDrawing.drawingId,
      name: currentDrawing.name,
      jsonData: currentDrawing.drawing,
    };
    dispatch(setSelectedDrawing(drawingData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg pt-12 pb-24 space-y-4">
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
        <div>
          <h1 className="pt-2 pb-2 text-right">
            <Link
              href="/drawNew"
              className="px-4 py-2 text-white
              bg-indigo-500 rounded-md
              hover:bg-indigo-600 focus:outline-none
              focus:bg-indigo-700"
            >
              Create a new drawing
            </Link>
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">My Drawings</h2>
        <p className="text-base">Click on a drawing to view</p>
        {userDrawings.map((drawing) => (
          <div key={drawing.drawingId} className="mb-4">
            <li>
              <Link
                href="/loadDrawing"
                onClick={handleLoadDrawing}
                data-drawing={JSON.stringify(drawing)}
                className="text-l text-indigo-900"
              >
                {drawing.name}
              </Link>
            </li>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
