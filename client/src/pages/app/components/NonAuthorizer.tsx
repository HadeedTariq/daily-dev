import { useNavigate } from "react-router-dom";
import { LockIcon } from "lucide-react";

const Authenticate = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="absolute inset-0 bg-grid-gray-200/50 dark:bg-grid-gray-800/50 bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="relative text-center p-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out hover:scale-105">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600 dark:bg-orange-500 rounded-full p-3 shadow-lg">
          <LockIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-4">
          Authentication Required
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          To access this page, please log in to your account. Your security is
          our priority.
        </p>
        <button
          className="px-6 py-3 text-white bg-orange-600 dark:bg-orange-500 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          onClick={() => {
            navigate("/auth/login");
          }}
        >
          <span className="flex items-center justify-center">
            <LockIcon className="w-5 h-5 mr-2" />
            Authenticate
          </span>
        </button>
      </div>
    </div>
  );
};

export default Authenticate;
