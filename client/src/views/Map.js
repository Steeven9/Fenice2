import { List, ListItem, ListItemAvatar, ListItemText, Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import mapLocations from '../util/mapLocations';

const Map = () => {
  let map;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
    map = L.map('map').setView([43.4467, -23.045], 6);
    const mapOptions = {
      tms: true,
      updateWhenIdle: false,
      updateInterval: 50,
      keepBuffer: 4,
      maxZoom: 9,
    };
    // eslint-disable-next-line no-undef
    L.tileLayer('https://pathfinderwiki.com/maps/golarion-tile/tiles/{z}/{x}/{y}', {
      ...mapOptions,
      attribution:
        'Map data &copy; <a href="https://www.dungeonetics.com/golarion-geography">John Mechalas</a>, <a href="https://paizo.com/community/communityuse">Paizo CUP</a>',
    }).addTo(map);

    // eslint-disable-next-line no-undef
    L.tileLayer('https://pathfinderwiki.com/maps/golarion-tile/tiles-relief/{z}/{x}/{y}', {
      ...mapOptions,
      opacity: 0.15,
      maxNativeZoom: 6,
    }).addTo(map);

    // eslint-disable-next-line no-undef
    L.control
      .scale({
        position: 'topright',
        maxWidth: 100,
      })
      .addTo(map);

    mapLocations.forEach((el) => {
      // eslint-disable-next-line no-undef
      const marker = L.marker(el.position).addTo(map);
      marker.bindPopup(`<b>${el.name}</b><br>${el.description}`);
    });

    const onMapClick = (e) => {
      console.info('Position: ' + e.latlng);
    };

    map.on('click', onMapClick);
  }, [mapLocations]);

  const focusMap = (position) => {
    map.flyTo(position);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />

      <div id="map" style={{ height: '70vh' }}></div>

      <List>
        {mapLocations
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((el) => (
            <ListItem alignItems="flex-start" key={el.name}>
              <ListItemAvatar style={{ cursor: 'pointer' }} onClick={() => focusMap(el.position)}>
                <LocationOnIcon />
              </ListItemAvatar>
              <ListItemText primary={el.name} secondary={el.description} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default Map;