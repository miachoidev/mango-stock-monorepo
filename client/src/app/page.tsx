import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full h-[100vh] justify-center items-center">
      <div className="flex flex-col gap-2 bg-blue-300 w-[100px] h-[100px] justify-center items-center rounded-md">
        <Link href="/chat">Chat</Link>
      </div>
    </div>
  );
}
