"use client";
import { api } from "@/api";
import Data from "@/data/book.json";
import { useEffect, useMemo, useState } from "react";
import type { Book } from "./typescript";

const books: Book[] = Data.library.map((book) => book.book);
const genres: Book["genre"][] = Array.from(
  new Set(books.map((books) => books.genre)),
);

export default function Home(): React.JSX.Element {
  const [genre, setGenre] = useState<Book["genre"]>("");
  const [readList, setReadList] = useState<Set<Book["ISBN"]>>(() => new Set());

  const matches = useMemo<Book[]>(() => {
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
    <article>
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
          <li key={book.ISBN} onClick={() => handleReadListClick(book.ISBN)}>
            <img
              src={book.cover}
              alt={book.title}
              className="aspect-[9/14] object-cover"
            />
            <p>
              {book.title} {readList.has(book.ISBN) && <span>⭐</span>}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
