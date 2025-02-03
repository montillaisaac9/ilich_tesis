import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Link href="/pages/auth/login">
        <button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-all duration-300">
          Ir a Login
        </button>
      </Link>
    </div>
  );
}
