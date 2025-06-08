import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { motion, AnimatePresence } from "framer-motion";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/utils/firebase";
import { toast } from "@/hooks/use-toast";
import {doc, setDoc} from "firebase/firestore";
import { LoaderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toggleMode = () => setIsLogin(!isLogin);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log("User logged in:", user);
      toast({
        title: "Login Successful!",
        description: `Welcome back, You have successfully logged in.`,
        variant: "default"
      });
      navigate("/plan");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try{
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      toast({
        title: "Registration Successful!",
        description: `Welcome ${fullName || email}! Your account has been created successfully.`,
        variant: "default"
      });
      setIsLogin(true);
      console.log("User created:", user);
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Failed to Register User",
        description: error.message,
        variant: "destructive"
      });
    } finally{
      setEmail("");
      setPassword("");
      setFullName("");
      setIsLoading(false);
    }
  }

  return (
    <div className="h-[80vh] flex items-center justify-center px-4">
      <p className="absolute top-40 text-2xl font-semibold">
        Login Now to plan your dream trip!
      </p>
      <div className="w-full max-w-md border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <div className="flex items-center space-x-2">
            <label className="text-sm">Signup</label>
            <Switch.Root
              checked={isLogin}
              onCheckedChange={toggleMode}
              className="w-10 h-6 bg-green-500 rounded-full relative data-[state=checked]:bg-indigo-500 transition-colors"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transform transition-transform data-[state=checked]:translate-x-4 translate-x-1" />
            </Switch.Root>
            <label className="text-sm">Login</label>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-4"
            >
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-gray-300 text-black p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center gap-2 justify-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                onClick={(e) => handleLogin(e)}
              >
                Login {isLoading && <LoaderIcon className="animate-spin" />}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-gray-300 text-black p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center gap-2 justify-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                onClick={(e) => handleRegister(e)}
                disabled={isLoading}
              >
                Sign Up {isLoading && <LoaderIcon className="animate-spin" />}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
