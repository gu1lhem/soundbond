import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UidContext } from "../Appcontext";
import { most_listened_users, top_trend } from "../../actions/insights.actions"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title, } from 'chart.js';
import insightsReducer from "../../reducers/insightsReducer";
import {faker} from '@faker-js/faker';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};


function Statistique() {
  const mostListened = useSelector((state) => state.insightsReducer.getMostListenedResponse);
  const topTrend = useSelector((state) => state.insightsReducer.getTopTrendResponse);
  const dispatch = useDispatch();
  const uid = useContext(UidContext);
  let current_year = new Date().getFullYear();
  let [dataDoghnut, setDataDoghnut] = useState({
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  

  useEffect(() => {
    dispatch(most_listened_users(uid));
    dispatch(top_trend());
  }, []);

  useEffect(() => {
    if(topTrend){
      let tags = []; 
      let occurence = []; 
      topTrend.map(e => {
        tags.push(e.tag); 
        occurence.push(e.apparition);
        console.log("e: ", e);
      });
      let temp = {
        labels: tags, 
        datasets:[
          {
            label: 'Top trends',
            data: occurence,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          }
        ]
      }; 
      console.log("TEMP: ", temp); 
      setDataDoghnut(temp); 
    }
  }, [topTrend])
  

  return (
    <>
    <div>
      Les utilisateurs que j'écoute le plus sur l'année {current_year}
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        { mostListened !== null ? 
        mostListened.map((data, index) => {
          return(
            <div>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={index} />
                </ListItemAvatar>
                <ListItemText
                  primary={data.username}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          )
        }): null}
      </List>
      
      <div>
        {
          topTrend !== null ? 
          <Doughnut data={dataDoghnut}/>: null
        }
        
      </div>

      <Bar data={data} />  
      </div>

    </>
  );
}
export default Statistique;
