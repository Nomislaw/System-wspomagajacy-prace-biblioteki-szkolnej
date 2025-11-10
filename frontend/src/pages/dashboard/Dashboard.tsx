import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Password from "../../components/settings/Password";
import Profile from "../../components/settings/Profile";
import UsersList from "../../components/admin/UsersList";
import AddUser from "../../components/admin/AddUser";
import { User,Category, ReservationStatus, BorrowStatus } from "../../types/Index";
import "./index.css";
import ProtectedRoute from "../../components/ProtectedRoute";
import AuthorsList from "../../components/librarian/AuthorsList";
import AddAuthor from "../../components/librarian/AddAuthor";
import AddCategory from "../../components/librarian/AddCategory";
import CategoryList from "../../components/librarian/CategoryList";
import PublisherList from "../../components/librarian/PublisherList";
import AddPublisher from "../../components/librarian/AddPublisher";

import AddBook from "../../components/librarian/AddBook";
import BookList from "../../components/librarian/BookList";
import EditBook from "../../components/librarian/EditBook";
import ReservationList from "../../components/librarian/ReservationList";
import BorrowList from "../../components/librarian/BorrowList";
import { CategoryService } from "../../api/CategoryService";
import Catalog from "../../components/user/Catalog";
import MyReservationsList from "../../components/user/MyReservationsList";
import MyBorrowsList from "../../components/user/MyBorrowsList";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
   const [categories, setCategories] = useState<Category[]>([]);
   useEffect(() => {
       const fetchCategories = async () => {
         const data = await CategoryService.getAllCategories();
         setCategories(data);
       };
   
       fetchCategories();
     }, []);

  return (
    <div className={"dashboard"}>
      <Sidebar user={user}/>

      <div className="main-content">
        <Navbar user={user} onLogout={onLogout}/>

        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="catalog" />} />

            <Route path="/settings/" element={<Navigate to="profile" />} />

            <Route path="/my-reservations/" element={<Navigate to="active" />}/>
            <Route path="/my-reservations/">
                <Route path="active" element={<MyReservationsList statusFilter={ReservationStatus.Active}/>} />
                <Route path="completed" element={<MyReservationsList statusFilter={ReservationStatus.Completed}/>} />
                <Route path="canceled" element={<MyReservationsList statusFilter={ReservationStatus.Canceled}/>} />
                <Route path="expired" element={<MyReservationsList statusFilter={ReservationStatus.Expired}/>} />
              
            </Route>


            <Route path="/my-borrows/" element={<Navigate to="active" />}/>
            <Route path="/my-borrows/">
                 <Route path="active" element={<MyBorrowsList statusFilter={[BorrowStatus.Active]}/>} />
                <Route path="overdue" element={<MyBorrowsList statusFilter={[BorrowStatus.Overdue]}/>} />
                <Route path="returned" element={<MyBorrowsList statusFilter={[BorrowStatus.Returned,BorrowStatus.ReturnedLate]}/>} />
                <Route path="damaged" element={<MyBorrowsList statusFilter={[BorrowStatus.Damaged, BorrowStatus.Lost]}/>} />
                
            </Route>


            <Route path="/catalog/" element={<Navigate to="all" />}/>
            <Route path="/catalog/">
                <Route path="all" element={<Catalog/>} />
                 {categories.map(category => (
                <Route path={category.name} element={<Catalog categoryId={category.id}/>} />
                ))}
            </Route>


            <Route path="/admin/" element={<ProtectedRoute user={user} allowedRoles={["Administrator"]}><Navigate to="users" /></ProtectedRoute>}/>
            <Route path="/admin/">
                    <Route path="users" element={<ProtectedRoute user={user} allowedRoles={["Administrator"]}><UsersList /></ProtectedRoute>} />
                    <Route path="users">
                    <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Administrator"]}><AddUser /></ProtectedRoute>} />
                    </Route>
            </Route>

            <Route path="/librarian/" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><Navigate to="borrows" /></ProtectedRoute>}/>
            <Route path="/librarian/">
                    <Route path="authors" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AuthorsList /></ProtectedRoute>} />
                      <Route path="authors">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddAuthor /></ProtectedRoute>} />
                    </Route>

                    <Route path="books" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><BookList /></ProtectedRoute>} />
                      <Route path="books">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddBook /></ProtectedRoute>} />
                      <Route path="edit/:id" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><EditBook /></ProtectedRoute>} />
                    </Route>

                    <Route path="categories" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><CategoryList /></ProtectedRoute>} />
                      <Route path="categories">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddCategory /></ProtectedRoute>} />
                    </Route>

                    <Route path="borrows" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><BorrowList /></ProtectedRoute>} />
                      {/* <Route path="borrows">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddAuthor /></ProtectedRoute>} />
                    </Route> */}

                    <Route path="publishers" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><PublisherList /></ProtectedRoute>} />
                      <Route path="publishers">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddPublisher /></ProtectedRoute>} />
                    </Route>

                    <Route path="reservations" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><ReservationList /></ProtectedRoute>} />
                      {/* <Route path="reservations">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddAuthor /></ProtectedRoute>} />
                    </Route> */}
            </Route>


                <Route path="settings">
                    <Route path="password" element={<Password />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
