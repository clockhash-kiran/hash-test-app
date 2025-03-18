import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <> {/* Use a fragment to wrap multiple elements */}
      <h1 className="text-xl">Home</h1>
      <Link className={buttonVariants()} href="/admin">
        Admin
      </Link>
    </>
  );
}