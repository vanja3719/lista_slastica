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
import CakeDetail from "./pages/CakeDetail.jsx";
import Favorites from "./pages/Favorites.jsx";
import AddCake from "./pages/AddCake.jsx";

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/cake/:id" component={CakeDetail} />
      <Route path="/user">
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signout" component={SignOut} />
        <Route path="/resetpassword" component={ResetPassword} />
      </Route>
      <Route path="/app" component={AuthBoundary}>
        <Route path="/profile" component={Profile} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/add" component={AddCake} />
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
        <div class="navbar-start gap-2">
          <Show when={isAuthenticated()}>
            <a href="/app/favorites" class="btn btn-ghost btn-sm text-[#e5989b] gap-1.5 hidden sm:inline-flex hover:bg-[#fdf2f2]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Favoriti
            </a>
            <a href="/app/add" class="btn btn-ghost btn-sm text-[#7a7a7a] gap-1.5 hidden sm:inline-flex hover:bg-[#fdf2f2] hover:text-[#e5989b]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Dodaj
            </a>
          </Show>
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
            <a href="/app/profile" class="btn btn-ghost btn-sm text-[#7a7a7a] hover:text-[#e5989b] hidden sm:inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Profil
            </a>
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