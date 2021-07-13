import logo from './logo.svg';
import './App.css';
import Todo from "./Todo";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
    <div className="App">
      <h2 className="App-header">
        TODO App
      </h2>
        <ErrorBoundary>
            <Todo />
        </ErrorBoundary>
    </div>
  );
}

export default App;