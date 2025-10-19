import React from "react";

interface LoansProps { userRole: "User" | "Librarian" | "Administrator"; }

const Loans: React.FC<LoansProps> = ({ userRole }) => <div>Wypożyczenia (rola: {userRole})</div>;

export default Loans;
