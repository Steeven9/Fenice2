"use client";

import { LinesList, MapLocation } from "@/types/Map";
import { Icon, LatLngBoundsExpression } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

export interface LeafletLayer {
  url: string;
  attribution?: string;
  image?: boolean;
  bounds?: LatLngBoundsExpression;
  options?: Object;
}

interface Props {
  position: [number, number];
  zoom: number;
  layers: LeafletLayer[];
  markers?: MapLocation[];
  lines?: LinesList[];
}

export default function LeafletMap({
  position,
  zoom,
  layers,
  markers = [],
  lines = [],
}: Readonly<Props>) {
  const mapOptions = {
    tms: true,
    updateWhenIdle: false,
    updateInterval: 50,
    keepBuffer: 4,
    maxZoom: 9,
  };

  const markersList = markers.map((el) => {
    const icon = new Icon({
      iconUrl: `/assets/marker${el.marker}.png`,
      iconSize: [25, 41],
      iconAnchor: [12.5, 41],
    });
    return (
      <Marker position={el.position} key={el.name + el.dateVisited} icon={icon}>
        <Popup>
          <b>{el.name}</b>
          <br />
          <i>{el.description}</i>
          <br />
          Visited: {el.dateVisited ?? "never"}
        </Popup>
      </Marker>
    );
  });

  const linesList = lines.map((el) => (
    <Polyline
      key={el.points.toString()}
      pathOptions={el.options}
      positions={el.points}
    />
  ));

  const MapPositionLogger = () => {
    useMapEvents({
      click(e) {
        console.info(`Position: [${e.latlng.lat}, ${e.latlng.lng}]`);
        navigator.clipboard.writeText(`[${e.latlng.lat}, ${e.latlng.lng}],`);
      },
    });
    return null;
  };

  return (
    <MapContainer center={position} zoom={zoom} className="h-[90%]">
      {layers.map((layer) => {
        if (layer.image) {
          return (
            <ImageOverlay
              url={layer.url}
              key={layer.url}
              crossOrigin="anonymous"
              bounds={layer.bounds!}
            />
          );
        } else {
          return (
            <TileLayer
              attribution={layer.attribution}
              url={layer.url}
              key={layer.url}
              {...mapOptions}
              {...layer.options}
            />
          );
        }
      })}
      {markersList}
      {linesList}
      <MapPositionLogger />
    </MapContainer>
  );
}
