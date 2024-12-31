import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './app.css';

interface MyProp {
  count: number;
}

const MyComponent : React.FunctionComponent<MyProp> = (props : MyProp) => {
  return <h1 className="text-primary text-4xl font-bold bg-green-200">{props.count}</h1>;
}

function App() {
  return (
    <div>
      <MyComponent count={3} />
      <h1>
        Hello
      </h1>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
