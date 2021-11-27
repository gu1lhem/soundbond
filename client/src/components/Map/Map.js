import React, { useRef, useEffect, useState, useContext } from "react";
import mapboxgl from "mapbox-gl";
import SearchBox from "../../components/Search/SearchBox";
import "./Map.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl/dist/mapbox-gl";
import { ReactReduxContext } from 'react-redux'
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


const clearMarkers = async (markers_list) => {
  // Deletes markers from the map.
  if(markers_list){
    for (var i = markers_list.length - 1; i >= 0; i--) {
      markers_list[i].remove();
    }
  }
  return true;
}

const Map = ({ post_points }) => {
    // Access the store via the `useContext` hook
    const { store } = useContext(ReactReduxContext)

  const mapContainerRef = useRef(null);
  const markers_list = [];

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(1.5);

  const [search_results, setSearchResults] = useState('');

  const childToParent = async (results) => {
    console.log("tamer")
    store.dispatch(clearMarkers(markers_list));
    console.log("putain");
    setSearchResults(results);
  }

  useEffect(() => {
    // Initialize map when component mounts
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      width: 200,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );
    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    for (const e of post_points) {
      // create a HTML element for each feature
      const el = document.createElement("div");
      el.className = "marker ";

      // make a marker for each feature and add it to the map
      new mapboxgl.Marker(el)
        .setLngLat([
          e.publishing.soundlocation.longitude,
          e.publishing.soundlocation.latitude
        ])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<h5>${e.publishing.soundlocation.longitude}, ${e.publishing.soundlocation.latitude}</h5>
              <p>${e.description}</p>
              <p>posté par <b>${e.publisher.username}</b></p>` //TODO ajouter un lien vers la page utilisateur de l'User.

            )
        )
        .addTo(map);
        markers_list.push(el);
    }
    console.log("tamer2");

    // Clean up on unmount
    return () => map.remove();
    
  }, [post_points]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SearchBox
        placeholder="SearchBox"
        className="col-4 btn btn-dark"
        childToParent={childToParent}
      />

      <div className="container-fluid">
        <div className="sidebarStyle">
          <div>
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
        </div>
        <div className="map-container" ref={mapContainerRef} />
      </div>
      
    </>
  );
};

export default Map;
