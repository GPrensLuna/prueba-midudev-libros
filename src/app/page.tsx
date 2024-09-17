import HomePage from "./HomePage";
import type { Book } from "./typescript";

const api = {
  book: {
    list: async (): Promise<Book[]> =>
      import("@/data/book.json").then((data) =>
        data.library.map((book) => book.book),
      ),
  },
};

const page = async (): Promise<JSX.Element> => {
  const books = await api.book.list();
  const genres = Array.from(new Set(books.map((books) => books.genre)));

  return <HomePage books={books} genres={genres} />;
};

export default page;
