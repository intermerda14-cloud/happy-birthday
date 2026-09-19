import { Book } from "@/components/Book";

export default function Home() {
  return (
    <main style={{ height: "100dvh", width: "100%", background: "#160a1c", display: "grid", placeItems: "center" }}>
      <Book />
    </main>
  );
}