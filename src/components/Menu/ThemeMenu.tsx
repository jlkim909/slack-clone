import React, { useCallback, useState, useEffect } from "react";
import {
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  ListItemIcon,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { HexColorPicker } from "react-colorful";
import "../../firebase";
import {
  child,
  getDatabase,
  onChildAdded,
  push,
  ref,
  update,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../store/ThemeReducer";

function ThemeMenu() {
  const dispatch = useDispatch();
  const { user }: any = useSelector((state) => state);
  const [userTheme, setUserTheme] = useState<any>([]);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [mainTheme, setMainTheme] = useState<string>("#FFFFFF");
  const [subTheme, setSubTheme] = useState<string>("#FFFFFF");

  const handleClose = useCallback(() => {
    setShowThemeModal(false);
  }, []);

  const handleSaveTheme = useCallback(async () => {
    if (!user.currentUser?.uid) return;
    try {
      const db = getDatabase();
      const key = push(
        child(ref(db), "/users/" + user.currentUser.uid + "/theme")
      ).key;
      const newTheme = { mainTheme, subTheme };
      const updates = {} as any;
      updates["/users/" + user.currentUser.uid + "/theme/" + key] = newTheme;
      await update(ref(db), updates);
      handleClose();
    } catch (error) {
      console.error(error);
      handleClose();
    }
  }, [handleClose, mainTheme, subTheme, user.currentUser?.uid]);
  const handleChangeMain = useCallback((color: any) => {
    setMainTheme(color);
  }, []);
  const handleChangeSub = useCallback((color: any) => {
    setSubTheme(color);
  }, []);
  const handleClickOpen = useCallback(() => {
    setShowThemeModal(true);
  }, []);

  useEffect(() => {
    if (!user.currentUser?.uid) return;
    const db = getDatabase();
    const themeRef = ref(db, "/users/" + user.currentUser.uid + "/theme");
    const unsubscribe = onChildAdded(themeRef, (snap) => {
      setUserTheme((themeArr: any) => [snap.val(), ...themeArr]);
    });
    return () => {
      setUserTheme([]);
      unsubscribe?.();
    };
  }, [user.currentUser?.uid]);

  return (
    <>
      <List sx={{ overflow: "auto", width: 60, backgroundColor: "#150c16" }}>
        <ListItem onClick={handleClickOpen}>
          <ListItemIcon sx={{ color: "white" }}>
            <PaletteIcon />
          </ListItemIcon>
        </ListItem>
        {userTheme.map((theme: any, idx: any) => (
          <ListItem key={idx}>
            <div
              className="theme-box"
              onClick={() =>
                dispatch(setTheme(theme.mainTheme, theme.subTheme))
              }
            >
              <div
                className="theme-main"
                style={{ backgroundColor: theme.mainTheme }}
              ></div>
              <div
                className="theme-sub"
                style={{ backgroundColor: theme.subTheme }}
              ></div>
            </div>
          </ListItem>
        ))}
      </List>
      <Dialog open={showThemeModal} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <div>
              Main
              <HexColorPicker color={mainTheme} onChange={handleChangeMain} />
            </div>
            <div>
              Sub
              <HexColorPicker color={subTheme} onChange={handleChangeSub} />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSaveTheme}>테마 저장</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ThemeMenu;
