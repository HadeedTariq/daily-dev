import { useNavigate } from "react-router-dom";

const Authenticate = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Please Authenticate
        </h1>
        <p className="text-gray-600 mb-6">
          You need to log in to access this page. Please click the button below
          to authenticate.
        </p>
        <button
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          onClick={() => {
            navigate("/auth/login");
          }}
        >
          Authenticate
        </button>
      </div>
    </div>
  );
};

export default Authenticate;
