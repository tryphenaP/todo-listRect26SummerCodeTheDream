import TodosPage from "./features/Todos/TodosPage";
import Header from "./shared/Header";
import Logon from "./features/Logon";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (
    <>
      <Header />

      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon
          onSetEmail={setEmail}
          onSetToken={setToken}
        />
      )}
    </>
  );
}

export default App;