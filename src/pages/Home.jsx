import { Show } from "solid-js";
import { isAuthenticated } from "../services/auth.js";

export default function Home() {
    // Mock podatci za prikaz vizuala
    const mockCakes = [
        { id: 1, name: "Čokoladna Torta", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60", time: "60 min", tags: ["Čokolada", "Klasik"] },
        { id: 2, name: "Kolač od jagoda", img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&auto=format&fit=crop&q=60", time: "45 min", tags: ["Voće", "Ljetno"] },
        { id: 3, name: "Tiramisu", img: "https://images.unsplash.com/photo-1571115177098-24de37021cb5?w=500&auto=format&fit=crop&q=60", time: "30 min", tags: ["Kava", "Bez pečenja"] }
    ];

    return (
        <div class="max-w-6xl mx-auto flex flex-col gap-10">
            {/* Hero sekcija */}
            <div class="soft-card mt-8 p-10 md:p-14 lg:p-20 text-center flex flex-col items-center justify-center bg-gradient-to-b from-[#fdfbf7] to-[#ffffff]">
                <h1 class="text-5xl md:text-7xl font-bold mb-6 title-font text-[#4a4a4a] leading-tight">
                    Pronađi svoju <br className="hidden md:block"/><span class="text-[#e5989b] italic">slatku inspiraciju.</span>
                </h1>
                <p class="py-4 text-lg md:text-xl text-[#7a7a7a] body-font max-w-2xl mx-auto font-light">
                    Pregledajte našu pažljivo odabranu listu najukusnijih kolača, razne recepte i slastice za sve prigode. Spremajte omiljene i uživajte u jednostavnosti.
                </p>
                
                <Show when={!isAuthenticated()}>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full max-w-md">
                        <a href="/user/signup" class="btn btn-primary btn-lg flex-1">Registracija</a>
                        <a href="/user/signin" class="btn btn-accent btn-lg flex-1">Prijava</a>
                    </div>
                </Show>

                <Show when={isAuthenticated()}>
                    <div class="flex gap-4 justify-center mt-8">
                        <a href="/app/profile" class="btn btn-primary btn-lg px-10 shadow-md">Moj Profil</a>
                    </div>
                </Show>
            </div>

            {/* Mock Grid sekcija */}
            <div class="mt-4 mb-10">
                <h2 class="text-3xl font-bold title-font text-[#4a4a4a] text-center mb-8">Popularni Kolači</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockCakes.map(cake => (
                        <div class="soft-card overflow-hidden flex flex-col group cursor-pointer">
                            <div class="h-56 overflow-hidden relative">
                                <img src={cake.img} alt={cake.name} class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur text-sm px-3 py-1 rounded-full text-[#e5989b] font-semibold">
                                    {cake.time}
                                </div>
                            </div>
                            <div class="p-6 flex flex-col flex-1">
                                <h3 class="text-xl font-bold title-font text-[#4a4a4a] mb-2 group-hover:text-[#e5989b] transition-colors">{cake.name}</h3>
                                <div class="flex flex-wrap gap-2 mt-auto pt-4">
                                    {cake.tags.map(tag => (
                                        <span class="text-xs bg-[#f8f9fa] text-[#7a7a7a] px-3 py-1 rounded-full border border-[#eaeaea]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}