import React, { useEffect, useState } from "react";
import { Book } from "../types/Index";

interface BookListProps { userRole: "User" | "Librarian" | "Administrator"; }

const BookList: React.FC<BookListProps> = ({ userRole }) => {
  return <div>Lista książek (rola: {userRole})</div>;
};

export default BookList;
