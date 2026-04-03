// export default function Home() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold text-blue-600">
//         Welcome to Examify
//       </h1>
//     </main>
//   );
// }

/*timer*/
// "use client";

// import { useTimer } from "../hooks/timer";

// export default function Home() {
//   const { timeLeft, isRunning } = useTimer(60); // 60 seconds

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-4xl font-bold text-teal-600">
//         Timer: {timeLeft}s
//       </h1>

//       <p className="mt-4 text-gray-500">
//         {isRunning ? "Running..." : "Stopped"}
//       </p>
//     </div>
//   );
// }