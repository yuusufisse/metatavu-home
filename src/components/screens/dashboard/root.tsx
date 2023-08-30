import { type ReactElement, useState } from "react";
import "./root.css";

/**
 * 
 * @returns asdf
 */
export default function Root (): ReactElement {
  const [count, setCount] = useState<number>(0);
  return (
    <>
      <div>
      </div>
      <h1 className="title">Vite + React = AAAAAAAAAAAAAAAAAA</h1>
      <div className="card">
        <button onClick={() => { setCount(count + 1); }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}