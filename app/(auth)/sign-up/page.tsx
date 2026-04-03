export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-8 shadow-lg rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-3"
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
        />

        <button className="bg-blue-500 text-white p-2 w-full rounded">
          Create Account
        </button>
      </div>
    </div>
  );
}