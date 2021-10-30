import "../App.css";
import React, { useEffect } from "react";
import Microphone from "../components/Microphone/Microphone";
import { useDispatch, useSelector } from "react-redux";
import { get_soundlocation } from "../actions/soundlocation.actions";
import Post from "../components/Post/Post";
import Grid from "@material-ui/core/Grid";

import { getallPost } from "../actions/post.actions";

function Home() {
  const dispatch = useDispatch();

  // These, in 'state', are defined in index.js
  const allposts = useSelector((state) => state.postReducer); // On stocke tous les Posts (se mettra a jour automatiquement par rapport a letat du reducer).

  useEffect(() => {
    //Posts.shift(); // pour la map
    navigator.geolocation.getCurrentPosition(async function (positiongeo) {
      let position = {
        lat: positiongeo.coords.latitude,
        lng: positiongeo.coords.longitude,
      };
      dispatch(get_soundlocation(position));
      dispatch(getallPost());
    });
    // eslint-disable-next-line
  }, []);

  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async function (positiongeo) {
      let position = {
        lat: positiongeo.coords.latitude,
        lng: positiongeo.coords.longitude,
      };
      dispatch(get_soundlocation(position));
    });
    // eslint-disable-next-line
  }, []);

  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="row">
        <div className="container">
          <div className="row justify-content-center">
            <Microphone pushFile={null} />
          </div>
        </div>
        <div className="container">
          {
            <Grid container direction="column-reverse" spacing={3}>
              {allposts.length > 0 ? (
                allposts.map((i, index) => (
                  <Grid key={index} item>
                    <Post
                      //post
                      id_post={i.id}
                      like={i.like}
                      description={i.description}
                      //son
                      id_son={i.publishing ? i.publishing.id : null}
                      url={i.publishing ? i.publishing.url : null}
                      size={i.publishing ? i.publishing.size : null}
                      duration={i.publishing ? i.publishing.duration : null}
                      //position
                      id_position_son={
                        i.publishing.soundlocation
                          ? i.publishing.soundlocation.id
                          : null
                      }
                      latitude={
                        i.publishing.soundlocation
                          ? i.publishing.soundlocation.latitude
                          : null
                      }
                      longitude={
                        i.publishing.soundlocation
                          ? i.publishing.soundlocation.longitude
                          : null
                      }
                      like_users={i.liked_by ? i.liked_by : null}
                      publisher={i.publisher ? i.publisher : null}
                    />
                  </Grid>
                ))
              ) : (
                <p></p>
              )}
            </Grid>
          }
        </div>
      </div>
    </>
  );
}

export default Home;
