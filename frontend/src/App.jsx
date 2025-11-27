import './App.css'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import LoginPage from '../../frontend_jsx/src/pages/LoginPage'
import ChatPage from '../../frontend_jsx/src/pages/ChatPage'
// import ChatInterface from './pages/DummyPage'
// import DummyPage from './pages/DummyPage'
// import ChatHistorySidebar from './components/ChatPage/PreviousChat'


function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/chat-page" element={<ChatPage />}/>
        {/* <Route path='/dummy' element={<ChatHistorySidebar />} /> */}

        {/* <Route path='/dummy' element={<ChatInterface />} /> */}
      </Routes>
   </BrowserRouter>
  )
}

export default App
