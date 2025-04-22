  import React from 'react';
  import './App.css';
  import Sidebar from './components/Sidebar';
  import FloatingButtons from './components/FloatingButtons';
  import Header from './components/Header';
  import Background from './assets/Background_home.png';

  function App() {
    return (
      <div className="app" style={{ backgroundImage: `url(${Background})` }}>
        <Sidebar />
        <Header />
        <FloatingButtons />
      </div>
    );
  }

  export default App;
