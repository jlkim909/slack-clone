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
    //: 사용자의 로그인 생태에 대한 변경 사항에 대해 관찰자를 추가한다.
    // 로그인 또는 로그아웃 시에만 관찰자 트리거가 된다.
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!!user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  //dispatch로 정보롤 받아오는 loading 상태일 경우 로딩서클을 보여줌
  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress color="secondary" size={150} />
      </Stack>
    );
  }
  return (
    //Routes Route에 매치되는 첫번째 요소를 렌더링
    //Route 컴포넌트 속성에 설정된 URL과 현재 경로가 일치하면 해당하는 컴포넌트를 렌더링
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
