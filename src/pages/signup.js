import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { signupStart, signupSuccess, signupFailure } from "../redux/slices/authSlice";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch(signupStart());

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("User created:", user);
        dispatch(signupSuccess(user));
        router.push("/dashboard");
      })
      .catch((error) => {
        dispatch(signupFailure(err.message));
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Signup</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="email"
            name="email"
            maxLength={50}
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
            maxLength={20}
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
            Signup
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full px-4 py-2 text-white
              bg-indigo-500 rounded-md
              hover:bg-indigo-600 focus:outline-none
              focus:bg-indigo-700"
          >
            Login (for already registered users)
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
