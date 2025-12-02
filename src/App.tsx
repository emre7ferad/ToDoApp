import './App.css'
import { Route ,Routes } from 'react-router-dom';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AllTasks } from './pages/AllTasks';

function App() {

  return (
    <div>
      <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          
          <Route path="/sign-up" element={<SignUp/>}/>

          <Route path="/sign-in" element={<SignIn/>}/>

          <Route path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }
          />

          <Route path="/all-tasks" 
            element={
              <ProtectedRoute>
                <AllTasks/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
