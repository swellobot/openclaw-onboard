import { Navigate } from 'react-router-dom';

export default function WizardRedirect() {
  return <Navigate to={`/wizard/${crypto.randomUUID()}`} replace />;
}
