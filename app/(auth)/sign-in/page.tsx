export default function Signin() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-8 shadow-lg rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>

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

        <button className="bg-green-500 text-white p-2 w-full rounded">
          Login
        </button>
      </div>
    </div>
  );
}