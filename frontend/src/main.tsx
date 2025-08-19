import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AppProvider } from './context/app/AppProvider'
import { AuthProvider } from './context/auth/authProvider'
import { SocketProvider } from './context/socket/socketProvider'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AppProvider>
  </AuthProvider>
)
