import { Router, Route, Navigate } from "@solidjs/router";
import { isAuthenticated, authLoading } from "./services/auth.js";
import { Show } from "solid-js";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Error from "./pages/Error";
import SignOut from "./pages/SignOut";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/user">
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signout" component={SignOut} />
        <Route path="/resetpassword" component={ResetPassword} />
      </Route>
      <Route path="/app" component={AuthBoundary}>
        <Route path="/profile" component={Profile} />
      </Route>
      <Route path="/error" component={Error} />
      <Route path="*" component={NotFound} />
    </Router>
  )
}

function Layout(props) {
  return (
    <div class="flex flex-col min-h-screen">
      <div class="navbar sticky top-0 z-50 px-4 md:px-8 bg-base-100/90 backdrop-blur shadow-sm">
        <div class="navbar-start">
          {/* U navigaciji više nema lijeve tipke */}
        </div>
        <div class="navbar-center">
          <a href="/" class="btn btn-ghost text-2xl font-bold title-font tracking-wide text-[#e5989b] hover:bg-transparent">Lista Slastica</a>
        </div>
        <div class="navbar-end gap-3">
          <Show when={!isAuthenticated()}>
            <a href="/user/signin" class="btn btn-accent btn-sm md:btn-md hidden sm:inline-flex">
              Prijava
            </a>
            <a href="/user/signup" class="btn btn-primary btn-sm md:btn-md">
              Registracija
            </a>
          </Show>
          <Show when={isAuthenticated()}>
            <a href="/user/signout" class="btn btn-secondary btn-sm md:btn-md">
              Odjava
            </a>
          </Show>
        </div>
      </div>

      <main class="flex-grow pt-4 pb-12 px-2 md:px-8">{props.children}</main>

      <footer class="footer footer-center text-base-content p-6 mt-8 border-t border-[#eaeaea]">
        <aside>
          <p class="font-semibold opacity-70 body-font">Copyright © {new Date().getFullYear()} - Lista Slastica</p>
        </aside>
      </footer>
    </div>
  );
}

function NotFound() {
  return <Navigate href="/error" state={{ error: { title: "404", message: "Tražena stranica ne postoji." } }} />
}

function AuthBoundary(props) {
  return (
    <Show when={!authLoading()} fallback={
      <div class="flex justify-center items-center min-h-screen">
        <span class="loading loading-spinner loading-xl"></span>
      </div>
    }>
      {isAuthenticated() ?
        (props.children) :
        (<Navigate
          href="/error"
          state={{ error: { title: "401", message: "Pristup traženoj stranici nije dozvoljen." } }} />)}
    </Show>
  );
}