import auth from "../utils/Auth";
import EnterForm from "./EnterForm";
import React from "react";
import { useHistory } from "react-router-dom";

function Login({setLoggedIn}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const history = useHistory();

  function handleLoginSubmit(e) {
    e.preventDefault();
    auth
      .getLogIn(email, password)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        const jwt = localStorage.getItem("jwt");
        auth.checkToken(jwt).then((res) => {
          if (res) {
            setEmail(res.data.email);
            setLoggedIn(true);
          }
        }).then(()=>history.push('/'));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <EnterForm
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      title={"Вход"}
      buttonName={"Войти"}
      onSubmit={handleLoginSubmit}
    />
  );
}

export default Login;
