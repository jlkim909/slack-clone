import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Grid,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const IsImage = (message: any) => message.hasOwnProperty("image");
function ChatMessage({ message, user }: any) {
  return (
    <ListItem>
      <ListItemAvatar sx={{ alignSelf: "stretch" }}>
        <Avatar
          variant="rounded"
          sx={{ width: 50, height: 50 }}
          alt="profile image"
          src={message.user.avatar}
        />
      </ListItemAvatar>
      <Grid container sx={{ ml: 2 }}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "left" }}>
          <ListItemText
            sx={{ display: "flex" }}
            primary={message.user.name}
            primaryTypographyProps={{
              fontWeight: "bold",
              color:
                message.user.id === user.currentUser.uid ? "orange" : "black",
            }}
            secondary={dayjs(message.timestamp).fromNow()}
            secondaryTypographyProps={{ color: "gray", ml: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          {IsImage(message) ? (
            <img
              alt="message"
              src={message.image}
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <ListItemText
              sx={{ wordBreak: "break-all", alignItems: "left" }}
              primary={message.content}
            />
          )}
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default ChatMessage;
