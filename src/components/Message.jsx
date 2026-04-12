import { Show } from "solid-js";

export default function Message(props) {
    const isError = props.type && props.type === "error";
    const alertClass = isError ? "bg-red-50 text-red-600 border-red-100" : "bg-[#fdfbf7] text-[#4a4a4a] border-[#eaeaea]";
    const iconPath = isError 
        ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
        : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";

    return (
        <Show when={props.message}>
            <div role="alert" class={`flex items-center gap-3 p-4 rounded-xl border shadow-sm ${alertClass} max-w-2xl w-full mx-auto mb-6`}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPath} />
                </svg>
                <span class="font-semibold text-sm md:text-base">{props.message}</span>
            </div>
        </Show>
    );
}