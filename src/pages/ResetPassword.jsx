import { createSignal, Show } from "solid-js";
import { authService } from "../services/auth.js";
import Message from "../components/Message.jsx";

export default function ResetPassword() {
    const [error, setError] = createSignal(null);
    const [success, setSuccess] = createSignal(null);

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();
        const data = new FormData(e.target);
        const email = data.get("email");

        try {
            await authService.passwordReset(email);
            setSuccess(true);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div class="flex items-center justify-center min-h-[70vh] py-8">
            <div class="soft-card p-8 md:p-12 max-w-md w-full relative z-10 bg-white">
                <h1 class="text-4xl font-bold mb-8 w-full text-center title-font text-[#4a4a4a]">Oporavak Zaporke</h1>

                <Message message={error()} type="error" />

                <Show when={!success()}>
                    <form class="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <p class="text-sm text-center mb-2 text-[#7a7a7a] body-font">
                            Unesite e-mail s kojim ste registrirani i poslat ćemo vam poveznicu za novu zaporku.
                        </p>
                        <label class="floating-label w-full">
                            <input class="input input-md w-full" type="email" name="email" placeholder="E-mail adresa" required="true" />
                            <span class="bg-white px-1">E-mail adresa</span>
                        </label>

                        <div class="mt-4">
                            <button type="submit" class="btn btn-primary w-full shadow-md">Pošalji na E-mail</button>
                        </div>
                    </form>
                </Show>

                <Show when={success()}>
                    <div class="text-center">
                        <Message message="Na e-mail adresu ste primili upute za ponovno postavljanje zaporke." type="success" />
                        <a href="/user/signin" class="btn btn-secondary w-full mt-6">Povratak na prijavu</a>
                    </div>
                </Show>
            </div>
        </div>
    );
}