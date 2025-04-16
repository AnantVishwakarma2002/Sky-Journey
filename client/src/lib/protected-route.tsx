import { Route } from "wouter";

// Simplified implementation without auth checks
export function ProtectedRoute({
  path,
  component,
  roleRequired,
}: {
  path: string;
  component: () => React.JSX.Element;
  roleRequired?: "user" | "admin";
}) {
  // For now, just return the component directly
  return <Route path={path} component={component} />;
}
