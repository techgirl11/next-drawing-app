import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { setLoading, setError } from "../redux/slices/drawingSlice";
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
          console.log(data);
          setUserDrawings(data);
        } else {
          throw new Error('Failed to fetch user data');
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

  console.log(userDrawings);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg pt-24 pb-24">
        <h2 className="text-2xl font-semibold text-center mb-6">
          User Profile
        </h2>
        <h1 className="text-base font-semibold">Welcome User: {user.email}</h1>
        <h1><Link href='/drawNew' className='text-2xl font-semibold'>Create a new drawing</Link></h1>
        <h1>Your saved drawings</h1>
        {userDrawings.map((drawing) => (
                <div key={drawing.drawingId} className='mb-4'>
                    <li>{drawing.name}</li>
                </div>
            ))}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-4 py-2 text-white
              bg-indigo-500 rounded-md
              hover:bg-indigo-600 focus:outline-none
              focus:bg-indigo-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
