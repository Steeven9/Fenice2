import LinkButtons from "@/components/linkButtons";
import { itineraryPoints, markers, teleportPoints } from "@/lib/mapLocations";
import { LinesList, MapLocation } from "@/types/Map";
import { LatLngTuple } from "leaflet";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const LeafletMap = dynamic(() => import("@/components/leafletMap"), {
  ssr: false,
});

const links = [
  { name: "Bright Age", url: "/map/brightAge" },
  { name: "Dark Age", url: "/map/darkAge" },
  { name: "Golarion", url: "/map/golarion" },
];

export default async function SingleMapPage({
  params,
}: Readonly<{
  params: { map: string };
}>) {
  if (params.map == "brightAge") {
    const layers = [
      {
        url: "https://lafenice.soulsbros.ch/img/mappe/brightAge/{z}/tile_{x}_{y}.jpg",
        attribution: "Map data &copy; Sasha Toscano",
        options: {
          maxZoom: 5,
          tms: false,
          noWrap: true,
        },
      },
    ];

    return (
      <>
        <LinkButtons selected={params.map} links={links} />
        <LeafletMap
          position={[-9.79567758282973, 6.651439946725858]}
          zoom={2}
          layers={layers}
        />
      </>
    );
  }

  if (params.map == "darkAge") {
    const lines: LinesList[] = [
      {
        points: itineraryPoints as LatLngTuple[][],
        options: { color: "blue" },
      },
      { points: teleportPoints as LatLngTuple[][], options: { color: "red" } },
    ];

    const layers = [
      {
        url: "https://oznogon.com/golarion-tile/tiles/{z}/{x}/{y}",
        attribution:
          'Map data &copy; <a href="https://www.dungeonetics.com/golarion-geography">John Mechalas</a>, <a href="https://paizo.com/community/communityuse">Paizo CUP</a>',
      },
      {
        url: "https://oznogon.com/golarion-tile/tiles-relief/{z}/{x}/{y}",
      },
    ];

    return (
      <>
        <LinkButtons selected={params.map} links={links} />
        <LeafletMap
          position={[44, -10]}
          zoom={5}
          markers={markers as MapLocation[]}
          lines={lines}
          layers={layers}
        />
      </>
    );
  }

  if (params.map == "golarion") {
    return (
      <>
        <LinkButtons selected={params.map} links={links} />
        <iframe
          id="map"
          title="Map"
          src="https://map.pathfinderwiki.com/#location=3.76/42.98/-17.76"
          width="100%"
          height="90%"
        ></iframe>
      </>
    );
  }

  return notFound();
}
