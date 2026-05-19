import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const authenticated = useAppSelector((s) => s.auth.authenticated)

  if (!authenticated) return <Navigate to="/signin" replace />
  return children ? <>{children}</> : <Outlet />
}