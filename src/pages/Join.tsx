import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import TagIcon from "@mui/icons-material/Tag";
import { Link } from "react-router-dom";
import "../firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import md5 from "md5";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userReducer";

const IsPasswordValid = (password: string, confirmPassword: string) => {
  if (password.length < 6 || confirmPassword.length < 6) {
    return false;
  } else if (password !== confirmPassword) {
    console.log("flag1");
    return false;
  } else {
    return true;
  }
};

//회원가입 페이지
function Join() {
  //error 문구를 표시하기 위함
  const [error, setError] = useState<string>("");
  //Auth 정보를 송수신 하는 과정 동안 loading
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  //유저 정보 등록 FormData 사용
  const postUserDate = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        //createUserWithEmailAndPassword : promise 함수 await 사용해야한다.
        //: 지정된 이메일 주소 및 비밀번호와 연결된 새 사용자 계정을 생성한다.
        //: 계정이 생서되면 자동 로그인
        const { user } = await createUserWithEmailAndPassword(
          getAuth(),
          email,
          password
        );
        // updateProfile : 유저의 프로필 정보를 업데이트 한다.
        await updateProfile(user, {
          displayName: name,
          photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=retro`,
        });
        //firebase database에 user정보(name, avatar)를 등록
        await set(ref(getDatabase(), "users/" + user.uid), {
          name: user.displayName,
          avatar: user.photoURL,
        });
        dispatch(setUser(user));
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = data.get("name");
      const email = data.get("email");
      const password = data.get("password");
      const confirmPassword = data.get("confirmPassword");

      if (!name || !email || !password || !confirmPassword) {
        setError("모든 항목을 입력해주세요");
        return;
      }

      if (!IsPasswordValid(password as string, confirmPassword as string)) {
        setError("비밀번호를 확인해주세요");
        console.log(name, email, password, confirmPassword);
        return;
      }
      postUserDate(name as string, email as string, password as string);
    },
    [postUserDate]
  );

  useEffect(() => {
    if (!error) return;
    setTimeout(() => {
      setError("");
    }, 3000);
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <TagIcon />
        </Avatar>
        <Typography component="h3" variant="h5">
          회원가입
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                label="닉네임"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                label="이메일 주소"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                required
                fullWidth
                label="비밀번호"
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                required
                fullWidth
                label="비밀번호 확인"
                type="password"
              />
            </Grid>
          </Grid>
          {error ? (
            <Alert sx={{ mt: 3 }} severity="error">
              {error}
            </Alert>
          ) : null}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            loading={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            회원가입
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "blue" }}
              >
                이미 계정이 있나요? 로그인으로 이동
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Join;
