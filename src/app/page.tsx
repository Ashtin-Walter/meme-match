import { MemeMatch } from "../components/MemeMatch";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-gradient-to-b from-indigo-800 to-purple-900 text-white">
      <main className="flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center my-6 text-yellow-300 drop-shadow-lg">
          Meme Match
        </h1>
        <p className="text-lg md:text-xl mb-8 text-center">
          Race against the clock in this memory card flipping game!
        </p>
        <MemeMatch />
      </main>
    </div>
  );
}
