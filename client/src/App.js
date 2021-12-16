import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Routes from "./components/Routes/Routes";
import { UidContext } from "./components/Appcontext";
import { getPostTrend, getallPost } from "./actions/post.actions";
import { getUser } from "./actions/user.actions";

const backServerURL = process.env.REACT_APP_BACK_SERVER_URL;

const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = async () => {
      await axios({
        method: "get",
        url: backServerURL + `jwtid`,
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data.id);
        })
        .catch((err) => {
          console.log("No tokens");
        });
    };
    token();
    dispatch(getallPost());
    if (uid) {
      dispatch(getUser(uid));
      dispatch(getPostTrend(uid));
    } // eslint-disable-next-line
  }, [uid]);

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
