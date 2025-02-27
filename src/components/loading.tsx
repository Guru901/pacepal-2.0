import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="flex h-[40vh] w-full items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" />
    </div>
  );
}
