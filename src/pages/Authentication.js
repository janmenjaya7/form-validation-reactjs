import AuthForm from "../components/AuthForm";
import { redirect, json } from "react-router-dom";
function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;
export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  // console.log(request);
  const mode = searchParams.get("mode") || "login";
  // console.log(mode);
  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode" }, { status: 422 });
  }
  const data = await request.formData();
  // console.log("data", data);
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };
  // console.log(authData);
  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  // console.log("response", response);
  // console.log("authgata", authData);

  if (response.status === 422 || response.status === 401) {
    return response;
  }
  if (!response.ok) {
    throw json({ message: "could not authenticate user " }, { status: 500 });
  }
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem("token", token);
  return redirect("/");
}
