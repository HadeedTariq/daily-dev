function RegisterConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          Registration Successful!
        </h1>
        <p className="text-lg text-center mb-8">
          Thank you for registering! You can now log in to your account.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default RegisterConfirmation;
