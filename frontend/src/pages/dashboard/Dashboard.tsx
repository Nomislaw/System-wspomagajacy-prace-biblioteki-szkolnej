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
import AuthorsList from "../../components/librarian/bookProperties/AuthorsList";
import AddAuthor from "../../components/librarian/bookProperties/AddAuthor";
import AddCategory from "../../components/librarian/bookProperties/AddCategory";
import CategoryList from "../../components/librarian/bookProperties/CategoryList";
import PublisherList from "../../components/librarian/bookProperties/PublisherList";
import AddPublisher from "../../components/librarian/bookProperties/AddPublisher";

import AddBook from "../../components/librarian/book/AddBook";
import BookList from "../../components/librarian/book/BookList";
import EditBook from "../../components/librarian/book/EditBook";
import ReservationList from "../../components/librarian/userDependenties/ReservationList";
import BorrowList from "../../components/librarian/userDependenties/BorrowList";
import { CategoryService } from "../../api/CategoryService";
import Catalog from "../../components/user/Catalog";
import MyReservationsList from "../../components/user/MyReservationsList";
import MyBorrowsList from "../../components/user/MyBorrowsList";
import ReportPage from "../../components/librarian/ReportPage";
import BookCopiesList from "../../components/librarian/book/BookCopiesList";
import AddBookCopy from "../../components/librarian/book/AddBookCopy";
import SchoolClassesList from "../../components/librarian/userDependenties/SchoolClassesList";
import AddSchoolClass from "../../components/librarian/userDependenties/AddSchoolClass";
import StudentsList from "../../components/librarian/userDependenties/StudentsList";
import AddStudent from "../../components/librarian/userDependenties/AddStudent";
import ReportPageTeacher from "../../components/teacher/ReportPageTeacher";


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
                <Route path="expired" element={<MyReservationsList statusFilter={ReservationStatus.Expired}/>} />
              
            </Route>


            <Route path="/my-borrows/" element={<Navigate to="active" />}/>
            <Route path="/my-borrows/">
                 <Route path="active" element={<MyBorrowsList statusFilter={[BorrowStatus.Active, BorrowStatus.Overdue]}/>} />
                {/* <Route path="overdue" element={<MyBorrowsList statusFilter={[BorrowStatus.Overdue]}/>} /> */}
                <Route path="returned" element={<MyBorrowsList statusFilter={[BorrowStatus.Returned,BorrowStatus.ReturnedLate]}/>} />                
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

            <Route path="/teacher/" element={<ProtectedRoute user={user} allowedRoles={["Teacher"]}><Navigate to="reports" /></ProtectedRoute>}/>
            <Route path="/teacher/">
                    <Route path="reports" element={<ProtectedRoute user={user} allowedRoles={["Teacher"]}><ReportPageTeacher /></ProtectedRoute>} />
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
                      <Route path=":id/copies" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><BookCopiesList /></ProtectedRoute>} />
                      <Route path=":id/copies">
                        <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddBookCopy /></ProtectedRoute>} />
                      </Route>
                    </Route>

                    <Route path="categories" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><CategoryList /></ProtectedRoute>} />
                      <Route path="categories">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddCategory /></ProtectedRoute>} />
                    </Route>

                    <Route path="borrows" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><BorrowList /></ProtectedRoute>} />
                     
                    <Route path="publishers" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><PublisherList /></ProtectedRoute>} />
                      <Route path="publishers">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddPublisher /></ProtectedRoute>} />
                    </Route>

                    <Route path="reservations" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><ReservationList /></ProtectedRoute>} />

                    <Route path="school-classes" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><SchoolClassesList /></ProtectedRoute>} />
                    <Route path="school-classes">
                      <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddSchoolClass /></ProtectedRoute>} />
                      <Route path=":id/students" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><StudentsList /></ProtectedRoute>} />
                      <Route path=":id/students">
                        <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddStudent /></ProtectedRoute>} />
                      </Route>
                    </Route>
                    
                    <Route path="reports" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><ReportPage /></ProtectedRoute>} />
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
