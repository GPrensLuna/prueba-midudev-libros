import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: " 📚 midudev   ",
  description:
    "Prueba técnica de midudev creación de una pagina para ver libros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="grid-rows-[60px, 1fr,60px] m-auto grid max-h-screen max-w-screen-xl gap-4">
          <nav className="flex items-center text-2xl">
            <h1>♥ midudev </h1>
          </nav>
          <section>{children}</section>
          <footer className="flex items-center justify-center">
            <p>�� {new Date().getFullYear()} midudev. All rights reserved.</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
