import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SearchPage from "@/pages/search-page";
import FlightDetailsPage from "@/pages/flight-details-page";
import BookingsPage from "@/pages/bookings-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";
import MainLayout from "./components/layout/main-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <MainLayout>
          <HomePage />
        </MainLayout>
      )} />
      
      <Route path="/auth" component={AuthPage} />
      
      <Route path="/search" component={() => (
        <MainLayout>
          <SearchPage />
        </MainLayout>
      )} />
      
      <Route path="/flights/:id">
        {(params) => (
          <MainLayout>
            <FlightDetailsPage id={parseInt(params.id)} />
          </MainLayout>
        )}
      </Route>
      
      <ProtectedRoute 
        path="/bookings" 
        component={() => (
          <MainLayout>
            <BookingsPage />
          </MainLayout>
        )} 
      />
      
      <ProtectedRoute 
        path="/admin" 
        component={() => (
          <MainLayout>
            <AdminPage />
          </MainLayout>
        )} 
        roleRequired="admin" 
      />
      
      <Route component={() => (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
