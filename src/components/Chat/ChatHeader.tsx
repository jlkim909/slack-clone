import React from "react";
import { Grid, Paper, CardContent, Typography } from "@mui/material";

function ChatHeader({ channelInfo }: any) {
  return (
    <Grid container component={Paper} variant="outlined">
      <CardContent>
        <Typography variant="h5">{channelInfo?.name}</Typography>
        <Typography variant="body1">{channelInfo?.details}</Typography>
      </CardContent>
    </Grid>
  );
}

export default ChatHeader;
