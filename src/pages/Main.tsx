import { Box, Drawer, Toolbar } from "@mui/material";
import React from "react";
import Header from "../components/Header";
import ChannelMenu from "../components/Menu/ChannelMenu";
import Chat from "../components/Chat/Chat";
import ThemeMenu from "../components/Menu/ThemeMenu";
import { useSelector } from "react-redux";

function Main() {
  const { theme }: any = useSelector((state) => state);
  return (
    <Box sx={{ display: "flex", backgroundColor: theme.subTheme }}>
      <Header />
      <Drawer className="no-scroll" variant="permanent" sx={{ width: 300 }}>
        <Toolbar />
        <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
          <ThemeMenu />
          <ChannelMenu />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Chat />
      </Box>
    </Box>
  );
}

export default Main;
