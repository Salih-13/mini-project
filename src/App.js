import './App.css';
import {BrowserRouter,Link,Route,Routes } from 'react-router-dom';
import Signin from './Signin';
import Signupform from './Signupform';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Explore from './Explore';
import Home from './Home';
import Profile from './Profile'
import Books from './home/Books'
import Electronics from './home/Electronics';
import ChatHome from './ChatHome'
function App() {
  return (
    <div className='app'>
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path='/' element={<Signin />}/>
    <Route path='/signup' element={<Signupform />}/>
    <Route path="/home" element= {<Home/>}/> 
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/explore/*' element={<ExploreWithSidebar />} />
    <Route path='/books' element={<Books/>}/>
    <Route path='/electronics' element={<Electronics/>}/>
    <Route path='/chathome' element={<ChatHome/>}/>
    <Route path="/chat-home/:receiverId" element={<ChatHome />} />

    </Routes>
    </BrowserRouter>
    </div>);
  }

  function ExploreWithSidebar() {
    return (
      <div>
        <Sidebar />
        <Explore />
      </div>
    );
  }

  function HomeWithSidebar() {
    return (
      <div>
        
        <Sidebar />
        <Home />
      </div>
    );
  }

  
export default App;