import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AppProvider } from './context/app/AppProvider'
import { AuthProvider } from './context/auth/authProvider'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </AuthProvider>
)
