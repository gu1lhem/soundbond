import React, { useEffect, useRef, useContext, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { v4 as uuidv4 } from "uuid";

import { makeStyles } from "@material-ui/styles";
import { addVisit } from "../../actions/sound.actions";
import { UidContext } from "../Appcontext";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import { useDispatch } from "react-redux";
import PauseIcon from "@material-ui/icons/Pause";
import CheckIcon from "@material-ui/icons/Check";
import Grid from "@material-ui/core/Grid";
import DownloadIcon from "@mui/icons-material/Download";
import { blue } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    minWidth: 100,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
  },
  media: {
    width: "100%",
  },
  list: {
    padding: 0,
  },
  listItem: {
    //paddingBottom: 0
  },
  controls: {
    minWidth: "100px",
  },
  icon: {
    height: 18,
    width: 18,
  },
  avatar: {
    display: "inline-block",
  },
}));

export default function AudioPlayer(props) {
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferId = `wavesurfer--${uuidv4()}`;
  const uid = useContext(UidContext);
  const dispatch = useDispatch();
  const [visited, setVisited] = useState(() => {
    for (let i = 0; i < props.visit.length; i++) {
      if (props.visit[i].id === uid) {
        return true;
      }
    }
    return false;
  });
  const [compteurVisite, setCompteurVisite] = useState(props.visit.length);

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: `#${wavesurferId}`,
      waveColor: "grey",
      progressColor: "tomato",
      height: 60,
      cursorWidth: 1,
      cursorColor: "lightgray",
      barWidth: 2,
      normalize: true,
      responsive: true,
      fillParent: true,
    });

    const handleResize = wavesurfer.current.util.debounce(() => {
      wavesurfer.current.empty();
      wavesurfer.current.drawBuffer();
    }, 150);

    wavesurfer.current.on("play", () => setIsPlaying(true));
    wavesurfer.current.on("pause", () => setIsPlaying(false));
    wavesurfer.current.on("finish", async () => {
      if (uid != null && props.id_son != null) {
        if (!visited) {
          setCompteurVisite(compteurVisite + 1);
          setVisited(true);
        }

        await dispatch(addVisit(props.id_son, uid));
      }
    });
    window.addEventListener("resize", handleResize, false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (props.file_url) {
      // Si une URL est spécifiée, on charge un un blob puis un audio.
      fetch(props.file_url)
        .then((r) => r.blob())
        .then((blob) => {
          let audio = new Audio();
          audio.src = URL.createObjectURL(blob);
          wavesurfer.current.load(audio);
        });
    }
  }, [props.file_url]);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  };

  const stopPlayback = () => wavesurfer.current.stop();

  const classes = useStyles();

  let transportPlayButton;

  if (!isPlaying) {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        {" "}
        <PlayArrowIcon className={classes.icon} />{" "}
      </IconButton>
    );
  } else {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        {" "}
        <PauseIcon className={classes.icon} />{" "}
      </IconButton>
    );
  }

  const download = () => {
    if (props.file_url) {
      const url = props.file_url;
      const link = document.createElement("a");
      link.href = url;

      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <>
      <Grid item id={wavesurferId} />
      <Grid item className={classes.buttons}>
        <Grid item>
          {transportPlayButton}
          <IconButton onClick={stopPlayback}>
            {" "}
            <StopIcon className={classes.icon} />{" "}
          </IconButton>
          <IconButton onClick={download}>
            {" "}
            <DownloadIcon
              style={props.file_url ? { color: blue[500] } : {}}
              className={classes.icon}
            />{" "}
          </IconButton>
          {visited ? (
            <>
              {" "}
              <IconButton style={{ float: " right" }}>
                <CheckIcon
                  className={classes.icon}
                  style={{ marginLeft: "5px" }}
                />{" "}
                <span style={{ fontSize: "15px", marginLeft: "5px" }}> Lu</span>
              </IconButton>
            </>
          ) : (
            <span></span>
          )}
          lu par :
          <IconButton>
            <span style={{ fontSize: "15px" }}> {compteurVisite}</span>
            <VisibilityIcon
              className={classes.icon}
              style={{ marginLeft: "5px" }}
            />
          </IconButton>
          <p style={{ margin: "4px", fontSize: "13px" }}>{props.address}</p>
        </Grid>
      </Grid>
    </>
  );
}
