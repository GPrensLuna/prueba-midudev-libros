"use client";
import { api } from "@/api";
import { useEffect, useMemo, useState } from "react";
import type { Book } from "./typescript";

interface HomePageProps {
  books: ReadonlyArray<Book>;
  genres: ReadonlyArray<Book["genre"]>;
}

export default function HomePage({
  books,
  genres,
}: Readonly<HomePageProps>): React.JSX.Element {
  const [genre, setGenre] = useState<Book["genre"]>("");
  const [readList, setReadList] = useState<Set<Book["ISBN"]>>(() => new Set());

  const matches = useMemo<Readonly<Book[]>>(() => {
    if (genre) {
      return books.filter((book) => book.genre === genre);
    }

    return books;
  }, [genre]);

  const handleReadListClick = (isbn: Book["ISBN"]): void => {
    const draft = structuredClone(readList);
    draft.has(isbn) ? draft.delete(isbn) : draft.add(isbn);
    setReadList(draft);
    api.readList.upDate(Array.from(draft));
  };

  useEffect(() => {
    const unsubscribe = api.readList.onChange(setReadList);
    return () => unsubscribe();
  }, []);

  return (
    <article className="px-4">
      <nav className="rounded-xl py-2">
        <select
          name="FilterGenre"
          id="FilterGenre"
          className="w-40 rounded-xl p-2 px-4"
          value={genre}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setGenre(e.target.value)
          }
        >
          <option value="">All</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </nav>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
        {matches.map((book) => (
          <button
            key={book.ISBN}
            onClick={() => handleReadListClick(book.ISBN)}
            className="relative p-0 bg-slate-400 rounded-xl bg-transparent cursor-pointer focus:outline-none overflow-hidden"
          >
            <img
              src={book.cover}
              alt={book.title}
              className="aspect-[9/14] object-cover "
            />
            <p className="grid items-center">
              {book.title}
              <span className="text-2xl text-yellow-300">
                {readList.has(book.ISBN) ? "★" : "☆"}
              </span>
            </p>
          </button>
        ))}
      </ul>
    </article>
  );
}
