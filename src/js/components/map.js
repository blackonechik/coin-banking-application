import "../../styles/map.scss";
import { el, mount } from "redom";
import * as ymaps3 from "ymaps3";
import API from "../api";

async function initMap(container, data) {
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;
  const { YMapDefaultMarker } = await ymaps3.import(
    "@yandex/ymaps3-markers@0.0.1",
  );

  const markers = [
    {
      coordinates: [-100.3, 50.5],
      color: "#FD4E5D",
    },
  ];

  data.forEach((item) => {
    markers.push({
      coordinates: [item.lon, item.lat],
      color: "#FD4E5D",
    });
  });

  const map = new YMap(
    container,
    {
      location: {
        center: [37.588144, 55.733842],
        zoom: 10,
      },
    },
    [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})],
  );

  markers.forEach((marker) => {
    const markerItem = new YMapDefaultMarker(marker);
    map.addChild(markerItem);
  });
}

export default async function createMap() {
  const mapContainer = el("div.map__map");
  const container = el(
    "div.container.map__container",
    el("h1.title", "Карта банкоматов"),
    mapContainer,
  );
  API.getBanksPlaces().then((data) => {
    initMap(mapContainer, data);
  });

  return container;
}
