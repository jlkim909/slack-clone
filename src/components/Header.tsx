import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import TagIcon from "@mui/icons-material/Tag";
import { useSelector } from "react-redux";
import "../firebase";
import { getAuth, signOut } from "firebase/auth";
import ProfileModal from "./Modal/ProfileModal";

function Header() {
  const { user, theme }: any = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);
  const handleClickOpen = useCallback(() => {
    setShowProfileModal(true);
    handleCloseMenu();
  }, [handleCloseMenu]);
  const handleCloseProfileModal = useCallback(() => {
    setShowProfileModal(false);
  }, []);
  const handleOpenMenu = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleLogout = useCallback(async () => {
    await signOut(getAuth());
  }, []);
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#9a939b",
          backgroundColor: theme.mainTheme,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "50px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <TagIcon />
            <Typography variant="h6" component="div">
              SLACK
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleOpenMenu}>
              <Typography
                variant="h6"
                component="div"
                sx={{ color: "#9a939b" }}
              >
                {user.currentUser?.displayName}
              </Typography>
              <Avatar
                sx={{ marginLeft: "10px" }}
                alt="profileImage"
                src={user.currentUser?.photoURL}
              />
            </IconButton>
            {/* anchorEl은 메뉴 아이템에 사용할 인터페이스 */}
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleClickOpen}>
                <Typography textAlign="center">프로필이미지</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Log Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <ProfileModal
        open={showProfileModal}
        handleClose={handleCloseProfileModal}
      />
    </>
  );
}

export default Header;
