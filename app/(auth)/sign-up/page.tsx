export default function SignUp() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Create Account</h2>
      <input placeholder="Name" /><br /><br />
      <input placeholder="Email" /><br /><br />
      <input placeholder="Password" type="password" /><br /><br />
      <button>Register</button>
    </div>
  );
}