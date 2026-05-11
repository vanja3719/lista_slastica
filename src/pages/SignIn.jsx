import { createSignal } from "solid-js";
import { authService } from "../services/auth.js";
import Message from "../components/Message.jsx";
import { useNavigate } from "@solidjs/router";

export default function SignIn() {
    const navigate = useNavigate();

    const [error, setError] = createSignal(null);

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();
        const data = new FormData(e.target);
        const email = data.get("email");
        const password = data.get("password");

        try {
            await authService.signIn(email, password);
            navigate("/");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div class="flex items-center justify-center min-h-[70vh] py-8">
            <div class="soft-card p-8 md:p-12 max-w-md w-full relative z-10 bg-white">
                <h1 class="text-4xl font-bold mb-6 w-full text-center title-font text-[#4a4a4a]">Prijava</h1>

                <Message message={error()} type="error" />

                <form class="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <label class="floating-label w-full">
                        <input class="input input-md w-full" type="email" name="email" placeholder="E-mail adresa" required="true" />
                        <span class="bg-white px-1">E-mail adresa</span>
                    </label>

                    <label class="floating-label w-full">
                        <input class="input input-md w-full" type="password" name="password" placeholder="Zaporka" required="true" />
                        <span class="bg-white px-1">Zaporka</span>
                    </label>

                    <div class="flex flex-col gap-3 mt-4">
                        <button type="submit" class="btn btn-primary w-full shadow-md">Prijavi se</button>
                        <a class="text-sm font-semibold text-center text-[#7a7a7a] hover:text-[#e5989b] transition-colors mt-2 underline" href="/user/resetpassword">Zaboravljena zaporka?</a>
                    </div>
                </form>
            </div>
        </div>
    );
}