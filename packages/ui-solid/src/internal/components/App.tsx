import { ToastContainer } from '../../modules/toasts/ToastContainer'
import { ToastProvider } from '../../modules/toasts/ToastProvider'

export const App = () => (
  <ToastProvider>
    <ToastContainer />
  </ToastProvider>
)