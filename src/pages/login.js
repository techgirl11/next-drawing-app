import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch(loginSuccess(user));
        router.push("/dashboard");
      })
      .catch((error) => {
        dispatch(loginFailure(error.message));
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border
              border-gray-300 rounded-md
              focus:outline-none focus:ring-2
              focus:ring-indigo-500"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border
              border-gray-300 rounded-md
              focus:outline-none focus:ring-2
              focus:ring-indigo-500"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white
              bg-indigo-500 rounded-md
              hover:bg-indigo-600 focus:outline-none
              focus:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;