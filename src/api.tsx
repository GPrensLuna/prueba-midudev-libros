"use client";
import type { Book } from "./app/typescript";

export const api = {
  readList: {
    upDate: (readList: Book["ISBN"][]): void => {
      localStorage.setItem("readList", JSON.stringify(Array.from(readList)));
    },
    onChange: (
      callback: (readList: Set<Book["ISBN"]>) => void,
    ): (() => void) => {
      const getReadListArray: unknown = JSON.parse(
        localStorage.getItem("readList") ?? "[]",
      );

      if (
        Array.isArray(getReadListArray) &&
        getReadListArray.every((item) => typeof item === "string")
      ) {
        const readListSet = new Set<Book["ISBN"]>(getReadListArray);
        callback(readListSet);
      }

      const handleStorageChange = (event: StorageEvent): void => {
        if (event.key === "readList" && typeof event.newValue === "string") {
          const newReadListArray: unknown = JSON.parse(event.newValue);

          if (
            Array.isArray(newReadListArray) &&
            newReadListArray.every((item) => typeof item === "string")
          ) {
            callback(new Set<Book["ISBN"]>(newReadListArray));
          }
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => window.removeEventListener("storage", handleStorageChange);
    },
  },
};
