import React, { useState } from "react";

export default function PasswordInput() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div>
      <input
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}