export default function SignUp() {
  return (
    <div className="min-h-screen flex">

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-green-100 items-center justify-center p-10">
        <div className="text-center">
          <img
  src="/login-image.png"
  alt="login illustration"
  className="w-80 mx-auto mb-6"
/>
          <h2 className="text-xl font-semibold">
            Join Examify Today
          </h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-96">

          <h1 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h1>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border-b p-2 mb-4 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border-b p-2 mb-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border-b p-2 mb-6 outline-none"
          />

          <button className="w-full bg-black text-white py-2 rounded-full">
            Sign Up
          </button>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500">
              Sign In
            </a>
          </p>

        </div>
      </div>

    </div>
  );
}