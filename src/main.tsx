import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './context/AuthContext.tsx'

import { Provider } from 'react-redux'
import { store } from './store/store.ts'

const client = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <Router>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </Router>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
