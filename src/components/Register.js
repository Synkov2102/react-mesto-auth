import auth from "../utils/Auth";
import EnterForm from "./EnterForm";
import InfoTooltip from "./InfoTooltip";
import React from "react";

function Register(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [status, setStatus] = React.useState(false);

  function handleRegisterSubmit(e) {
      console.log(email)
      console.log(password)
    e.preventDefault();
    auth
      .getRegister(email, password)
      .then(() => {
        setStatus(true);
        setIsInfoTooltipOpen(true);
      })
      .catch((err) => {
        setStatus(false);
        setIsInfoTooltipOpen(true);
        console.log(err);
      });
  }

  return (
    <>
      <EnterForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        title={"Регистрация"}
        buttonName={"Зарегистрироваться"}
        onSubmit={handleRegisterSubmit}
      />
      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={() => setIsInfoTooltipOpen(false)}
        status={status}
      />
    </>
  );
}

export default Register;
