import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Join from "./pages/Join";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { clearUser, setUser } from "./store/userReducer";
import Main from "./pages/Main";
import { CircularProgress, Stack } from "@mui/material";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { isLoading, currentUser } = useSelector((state: any) => state.user);
  useEffect(() => {
    //onAuthStateChanged가 계속 쌓이는 걸 방지하기 위해 unsubscribe 사용
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!!user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress color="secondary" size={150} />
      </Stack>
    );
  }
  return (
    <Routes>
      <Route
        path="/"
        element={currentUser ? <Main /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/join"
        element={currentUser ? <Navigate to="/" /> : <Join />}
      />
    </Routes>
  );
}

export default App;
