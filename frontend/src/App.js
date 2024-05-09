
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home1 from './Pages/TaskCreation'
import Home from './Pages/Tasks'
import Login from './Pages/Login'
import Registration from './Pages/Registration'
import AddEvents from './Component/AddEvents';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route index element = {<Login />}/>
            <Route path = "/home" element = {<Home1 />}/>
            <Route path = "/login" element = {<Login />}/>
            <Route path = "/registration" element = {<Registration />}/>
            <Route path = "/addevent" element = {<AddEvents />}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;