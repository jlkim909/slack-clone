import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
import { setCurrentChannel } from "../../store/channelReducer";

function ChannelMenu() {
  const { theme }: any = useSelector((state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const [channelName, setChannelName] = useState<string>("");
  const [channelDetail, setChannelDetail] = useState<string>("");
  const [channels, setChannels] = useState<any>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>("");
  const [firstLoaded, setFirstLoaded] = useState<boolean>(true);
  const dispatch = useDispatch();

  const changeChannel = useCallback(
    (channel: any) => {
      if (channel.id === activeChannelId) return;
      setActiveChannelId(channel.id);
      dispatch(setCurrentChannel(channel));
    },
    [activeChannelId, dispatch]
  );

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const handleSubmit = useCallback(async () => {
    const db = getDatabase();
    const key = push(child(ref(db), "channels")).key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetail,
    };
    const updates = {} as any;
    updates["/channels/" + key] = newChannel;

    try {
      await update(ref(db), updates);
      setChannelName("");
      setChannelDetail("");
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }, [channelName, channelDetail]);
  const handleChangeChannelName = useCallback(
    (e: any) => setChannelName(e.target.value),
    []
  );
  const handleChangeChannelDetail = useCallback(
    (e: any) => setChannelDetail(e.target.value),
    []
  );

  useEffect(() => {
    const db = getDatabase();
    const unsubscribe = onChildAdded(ref(db, "channels"), (snapshot) => {
      setChannels((channelArr: any) => [...channelArr, snapshot.val()]);
    });
    return () => {
      setChannels([]);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (channels.length > 0 && firstLoaded) {
      setActiveChannelId(channels[0].id);
      dispatch(setCurrentChannel(channels[0]));
      setFirstLoaded(false);
    }
  }, [channels, firstLoaded, dispatch]);

  return (
    <>
      <List
        sx={{ overflow: "auto", width: 240, backgroundColor: theme.mainTheme }}
      >
        <ListItem
          secondaryAction={
            <IconButton sx={{ color: "#9a939b" }} onClick={handleClickOpen}>
              <AddIcon />
            </IconButton>
          }
        >
          <ListItemIcon sx={{ color: "#9a939b" }}>
            <ArrowDropDownIcon />
            <ListItemText
              primary="채널"
              sx={{ wordBreak: "break-all", color: "#9a939b" }}
            />
          </ListItemIcon>
        </ListItem>
        <List component="div" disablePadding sx={{ pl: 3 }}>
          {channels.map((channel: any) => (
            <ListItemButton
              selected={channel.id === activeChannelId}
              onClick={() => changeChannel(channel)}
              key={channel.id}
            >
              <ListItemText
                primary={`#${channel.name}`}
                sx={{ wordBreak: "break-all", color: "#918890" }}
              />
            </ListItemButton>
          ))}
        </List>
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>채널 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            생성할 채널명과 설명을 입력해주세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="채널명"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChangeChannelName}
          />
          <TextField
            margin="dense"
            label="설명"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChangeChannelDetail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit}>생성</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChannelMenu;
