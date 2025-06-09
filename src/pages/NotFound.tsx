import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="flex items-center gap-2 text-blue-500 hover:text-blue-700 underline">
          <HomeIcon/> Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
