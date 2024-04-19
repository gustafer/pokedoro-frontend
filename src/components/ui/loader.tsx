import { Loader2 } from "lucide-react";

export function Loader() {
    return (
        <div className="flex flex-row items-center justify-center p-2 rounded-md"><Loader2 className="animate-spin" />Loading...</div>
    )
}