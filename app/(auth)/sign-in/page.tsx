export default function SignIn() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Sign In</h2>
      <input placeholder="Email" /><br /><br />
      <input placeholder="Password" type="password" /><br /><br />
      <button>Login</button>
    </div>
  );
}