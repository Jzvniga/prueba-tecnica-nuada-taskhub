import './App.css'; 
import TaskHub from './components/TaskHub'; 

function App() {
  return (
<div className="app-container">
      <header className="app-header">
        <h1>Nuada AI - Task Hub</h1> 
      </header>
      <main>
        <TaskHub />
      </main>
  
    </div>
  );
}
export default App;