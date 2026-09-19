import { Book } from "@/components/Book";

export default function Home() {
  return (
    <main
      style={{
        height: "100dvh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
      }}
    >
      <Book />
    </main>
  );
}