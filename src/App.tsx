import { useState } from "react";
import Component from "./uihelper/Component";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer"></a>
        <a href="https://react.dev" target="_blank" rel="noreferrer"></a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Component
        onCapture={({ date, feedback, image, path }) => {
          console.log({ date, feedback, image, path });
        }}
        trigger={<button>Click me</button>}
      />
    </>
  );
}

export default App;
