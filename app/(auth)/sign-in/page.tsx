export default function SignIn() {
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
          {/* <h2 className="text-xl font-semibold">
            Distance Learning Programs
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Attend live and recorded classes at your own convenience
          </p> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-96">

          <h1 className="text-2xl font-bold mb-2 text-center">
            EXAMIFY
          </h1>

          <p className="text-gray-500 text-center mb-8">
            Welcome Back
          </p>

          <input
            type="text"
            placeholder="Username or Email"
            className="w-full border-b p-2 mb-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border-b p-2 mb-2 outline-none"
          />

          <p className="text-right text-sm text-blue-500 mb-6 cursor-pointer">
            Forgot password?
          </p>

          <button className="w-full bg-black text-white py-2 rounded-full">
            Sign In
          </button>

          <div className="text-center my-6 text-gray-400">or</div>

          <button className="w-full border py-2 rounded-full">
            Sign in with Google
          </button>

          <p className="text-center mt-6 text-sm">
            Are you new?{" "}
            <a href="/sign-up" className="text-blue-500">
              Create an Account
            </a>
          </p>

        </div>
      </div>

    </div>
  );
}