import { createSignal, Show } from "solid-js";
import { authService } from "../services/auth.js";
import Message from "../components/Message.jsx";

export default function SignUp() {
    const [error, setError] = createSignal(null);
    const [success, setSuccess] = createSignal(false);

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get("name");
        const email = data.get("email");
        const password = data.get("password");
        const passwordConfirm = data.get("passwordConfirm");

        if (password != passwordConfirm) {
            setError("Zaporke se ne podudaraju");
            return;
        }

        try {
            await authService.signUp(email, password, name);
            setSuccess(true);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div class="flex items-center justify-center min-h-[75vh] py-8">
            <div class="soft-card p-8 md:p-12 max-w-md w-full relative z-10 bg-white">
                <h1 class="text-4xl font-bold mb-6 w-full text-center title-font text-[#4a4a4a]">Registracija</h1>

                <Message message={error()} type="error" />

                <Show when={!success()}>
                    <form class="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <label class="floating-label w-full">
                            <input class="input input-md w-full" type="text" name="name" placeholder="Ime" required="true" />
                            <span class="bg-white px-1">Ime</span>
                        </label>

                        <label class="floating-label w-full">
                            <input class="input input-md w-full" type="email" name="email" placeholder="E-mail adresa" required="true" />
                            <span class="bg-white px-1">E-mail adresa</span>
                        </label>

                        <label class="floating-label w-full">
                            <input class="input input-md w-full" type="password" name="password" placeholder="Zaporka" required="true" />
                            <span class="bg-white px-1">Zaporka</span>
                        </label>

                        <label class="floating-label w-full">
                            <input class="input input-md w-full" type="password" name="passwordConfirm" placeholder="Potvrda zaporke" required="true" />
                            <span class="bg-white px-1">Potvrda zaporke</span>
                        </label>

                        <div class="mt-4">
                            <button type="submit" class="btn btn-primary w-full shadow-md">Kreiraj Račun</button>
                        </div>
                    </form>
                </Show>

                <Show when={success()}>
                    <div class="text-center">
                        <Message message="Uspješno ste napravili korisnički račun!" type="success" />
                        <a href="/user/signin" class="btn btn-primary w-full mt-6">Otiđi na prijavu</a>
                    </div>
                </Show>
            </div>
        </div>
    );
}