import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {SignUp} from "./pages/SignUp";
import {SignIn} from "./pages/SignIn";
import Main from "./pages/Main";
import {AssignmentDetails} from "./pages/AssignmentDetails";
import {LessonDetails} from "./pages/LessonDetails";
import TestScreen from "./pages/TestPage";
import Header from "./pages/Header";
import ProfileScreen from "./pages/ProfilePage";
import AddAssignmentScreen from "./pages/AddAssignment";
import AddTestScreen from "./pages/AddTestScreen";
import AddMaterialScreen from "./pages/AddMaterialScreen";
import AddLessonScreen from "./pages/AddLessonScreen";
import TestResultsList from "./pages/TestResultCard";

function App() {
    return (
        <BrowserRouter>
            { localStorage.getItem('accessToken') &&
                <Header/>
            }
            <Routes>
                {localStorage.getItem('accessToken') ?
                    <>
                        <Route path="/" element={<Main/>}/>
                        <Route path="/assignments/:assignmentId" element={<AssignmentDetails/>}/>
                        <Route path="/add-assignment" element={<AddAssignmentScreen/>}/>
                        <Route path="/assignments/:assignmentId/lessons/:lessonId" element={<LessonDetails/>}/>
                        <Route path="/test/:testId" element={<TestScreen/>}/>
                        <Route path="/profile" element={<ProfileScreen/>}/>
                        <Route path="/assignments/:assignmentId/add-material" element={<AddMaterialScreen />} />
                        <Route path="/assignments/:assignmentId/add-lesson" element={<AddLessonScreen />} />
                        <Route path="/assignments/:assignmentId/add-test" element={<AddTestScreen />} />
                        <Route path="/assignments/:assignmentId/result" element={<TestResultsList/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </>
                    :
                    <>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/signin" element={<SignIn/>}/>
                        <Route path="*" element={<Navigate to="/signin"/>}/>
                    </>
                }
            </Routes>
        </BrowserRouter>
    );
}

export default App;
