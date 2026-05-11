import { createSignal, createEffect, Show } from "solid-js";
import { authService } from "../services/auth.js";
import { db } from "../lib/firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Message from "../components/Message.jsx";
import SeedButton from "../components/SeedButton.jsx";

export default function Profile() {
    const [userDoc, setUserDoc] = createSignal(null);
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal(null);
    const [success, setSuccess] = createSignal(null);

    const currentUser = authService.getCurrentUser();

    createEffect(async () => {
        if (!currentUser) return;
        try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDoc(docSnap.data());
            }
        } catch (err) {
            console.error("Error fetching user data", err);
        } finally {
            setLoading(false);
        }
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const data = new FormData(e.target);
        const name = data.get("name");

        try {
            // Update auth profile
            await authService.updateName(name);
            
            // Update firestore document
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                await setDoc(docRef, { name: name.trim(), role: userDoc()?.role || "user" }, { merge: true });
                setUserDoc({ ...userDoc(), name: name.trim() });
            }
            
            setSuccess("Profil je uspješno ažuriran.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div class="flex items-center justify-center min-h-[70vh] py-8">
            <div class="soft-card p-8 md:p-12 max-w-lg w-full relative z-10 bg-white">
                <div class="flex flex-col items-center justify-center mb-6">
                    <div class="avatar placeholder">
                      <div class="bg-[#e5989b] text-white text-4xl w-24 h-24 flex items-center justify-center rounded-full shadow-md">
                        <span class="uppercase font-bold title-font">{userDoc()?.name?.charAt(0) || currentUser?.email?.charAt(0) || "U"}</span>
                      </div>
                    </div>
                    {/* Značka uloge ispod avatara */}
                    <Show when={userDoc()?.role}>
                        <div class="mt-3">
                            <span class={`px-4 py-1 text-xs font-bold uppercase rounded-full tracking-wider ${userDoc()?.role === "admin" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                                {userDoc()?.role === "admin" ? "Admin" : "Običan korisnik"}
                            </span>
                        </div>
                    </Show>
                </div>
                <h1 class="text-4xl font-bold mb-8 text-center title-font text-[#4a4a4a] w-full">Uređivanje Profila</h1>

                <Show when={loading()}>
                    <div class="flex justify-center my-8">
                        <span class="loading loading-spinner text-black loading-lg"></span>
                    </div>
                </Show>

                <Show when={!loading()}>
                    <Message message={error()} type="error" />
                    <Show when={success()}>
                        <Message message={success()} type="success" />
                    </Show>

                    <form onSubmit={handleUpdate} class="flex flex-col gap-6 mt-4">
                        <label class="floating-label w-full">
                            <input class="input input-md w-full bg-gray-100 cursor-not-allowed text-[#7a7a7a]" type="email" value={currentUser?.email || ""} disabled />
                            <span class="bg-white px-1">E-mail adresa (nije promjenjivo)</span>
                        </label>

                        <label class="floating-label w-full">
                            <input class="input input-md w-full bg-gray-100 cursor-not-allowed font-bold" type="text" value={userDoc()?.role === "admin" ? "Administrator" : "Običan Korisnik"} disabled />
                            <span class="bg-white px-1 text-[#e5989b] font-bold">Vaša uloga</span>
                        </label>

                        <label class="floating-label w-full">
                            <input class="input input-md w-full" type="text" name="name" value={userDoc()?.name || currentUser?.displayName || ""} required />
                            <span class="bg-white px-1">Ime i prezime</span>
                        </label>

                        <div class="mt-4">
                            <button type="submit" class="btn btn-primary w-full shadow-md">Spremi promjene</button>
                        </div>
                    </form>

                    <SeedButton />
                </Show>
            </div>
        </div>
    );
}
