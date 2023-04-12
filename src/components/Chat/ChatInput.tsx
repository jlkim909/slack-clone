import React, { useState, useCallback } from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import "../../firebase";
import {
  getDatabase,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import Picker from "@emoji-mart/react";
import { useSelector } from "react-redux";
import ImageModal from "../Modal/ImageModal";

function ChatInput() {
  const { channel, user }: any = useSelector((state) => state);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);

  const handleClickOpen = useCallback(() => setImageModalOpen(true), []);
  const handleClickClose = useCallback(() => setImageModalOpen(false), []);
  const handleChange = useCallback((e: any) => setMessage(e.target.value), []);
  const handleTogglePicker = useCallback(() => {
    setShowEmoji((show) => !show);
  }, []);
  const handleSelectEmoji = useCallback((e: any) => {
    //파싱
    const sym = e.unified.split("-");
    const codesArray = [] as any;
    sym.forEach((el: any) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setMessage((messageValue) => messageValue + emoji);
  }, []);
  const createMessage = useCallback(
    () => ({
      timestamp: serverTimestamp(),
      user: {
        id: user.currentUser.uid,
        name: user.currentUser.displayName,
        avatar: user.currentUser.photoURL,
      },
      content: message,
    }),
    [
      user.currentUser.uid,
      user.currentUser.displayName,
      user.currentUser.photoURL,
      message,
    ]
  );
  const clickSendMessage = useCallback(async () => {
    if (!message) return;
    setLoading(true);
    try {
      await set(
        push(ref(getDatabase(), "messages/" + channel.currentChannel.id)),
        createMessage()
      );
      setLoading(false);
      setMessage("");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [message, createMessage, channel.currentChannel?.id]);

  return (
    <Grid container sx={{ p: "20px" }}>
      <Grid item xs={12} sx={{ position: "relative" }}>
        {showEmoji && (
          <div style={{ position: "absolute", bottom: "80px" }}>
            <Picker set="google" onEmojiSelect={handleSelectEmoji} />
          </div>
        )}
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleTogglePicker}>
                  <InsertEmoticonIcon />
                </IconButton>
                <IconButton onClick={handleClickOpen}>
                  <ImageIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={loading} onClick={clickSendMessage}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="off"
          label="메세지 입력"
          fullWidth
          value={message}
          onChange={handleChange}
        />
        {uploading ? (
          <Grid item xs={12} sx={{ m: "10px" }}>
            <LinearProgress variant="determinate" value={percent} />
          </Grid>
        ) : null}
        <ImageModal
          open={imageModalOpen}
          handleClose={handleClickClose}
          setPercent={setPercent}
          setUploading={setUploading}
        />
      </Grid>
    </Grid>
  );
}

export default ChatInput;
