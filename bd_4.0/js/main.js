import './style.css'
import { Map as OLMap, View, Feature, Collection } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Point from 'ol/geom/Point.js'
import { fromLonLat, transform } from 'ol/proj.js'
import VectorSource from 'ol/source/Vector.js'
import {Vector as VectorLayer} from 'ol/layer.js'
import {Icon, Style} from 'ol/style.js'
import { Stroke } from 'ol/style.js'
import {Draw, Modify, Snap} from 'ol/interaction.js';
import Polyline from 'ol/format/Polyline.js'
const url_osrm_route = '//router.project-osrm.org/route/v1/driving/';
const token = localStorage.getItem("admin_token");
console.log(token);
export function getItineraryData(id) {
  console.log('jтображается данные маршрута ' + id);
}
let isChange = false;
let newPoints = new Collection();
let newPointsData = [];
const vectorSource = new VectorSource({
  features: newPoints,
})
let polylines = new Collection();
const polylineSourse = new VectorSource({
  features: polylines
})
let shelters = new Collection();
let sheltersData = [];
const shelterSourse = new VectorSource({
  features: shelters,
});
const HOST = 'https://nyakatyan.ddns.net:5144';
const map = new OLMap({
  target: document.getElementById('map'),
})

const styles = {
  me: new Style({
    image: new Icon({
      anchor: [0.5, 1],
      crossOrigin: 'anonymous',
      src: '../images/marker.svg',
      scale: 0.1,
    }),
  }),
  shelter: new Style({
    image: new Icon({
      anchor: [0.5, 1],
      crossOrigin: 'anonymous',
      src: '../images/bus_stop.svg',
      scale: 0.05,
    }),
  }),
  route: new Style({
    stroke: new Stroke({
      width: 6,
      color: 'red'
    })
  })
}

CreateMap([47.8608426, 56.6407879]);
DisplayShelters();
DisplayItinerary(localStorage.getItem("id_itinerary"));
function CreateMap(coords) {
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
  })
  const shelterLayer = new VectorLayer({
    source: shelterSourse,
    style: styles.shelter,
  })
  const polylineLayer = new VectorLayer({
    source: polylineSourse,
    style: styles.route,
  })
  const rasterLayer = new TileLayer({
    source: new OSM(),
  })
  map.addLayer(rasterLayer);
  map.addLayer(vectorLayer);
  map.addLayer(polylineLayer);
  map.addLayer(shelterLayer);
  map.setView(new View ({
    center: fromLonLat(coords),
    zoom: 12,
  }))
}

function AddElementIntoDocument(idObj) {
  const text = document.createElement('div');
  text.className = "shelter_name";
  const textContent = document.createTextNode(sheltersData[sheltersData.findIndex(x => x.id == idObj)].name);
  text.appendChild(textContent);
  const arrow = document.createElement('div');
  arrow.className = "arrow_wrap";
  const down = document.createElement('button');
  down.value = "Down";
  down.className = "down"
  const downContent = document.createTextNode("Down");
  down.appendChild(downContent);
  const up = document.createElement('button');
  up.value = "Up";
  up.className = "up"
  const upContent = document.createTextNode("Up");
  up.appendChild(upContent);
  const div = document.createElement('div');
  arrow.appendChild(up);
  arrow.appendChild(down);
  div.appendChild(text);
  div.appendChild(arrow);
  div.className = "shelter";
  div.id = "" + idObj;
  div.addEventListener('click', (event) => {
    let target = event.target; 
    if (target.tagName === 'BUTTON' && target.value == "Up") {
      let id;
      if ((id = newPointsData.findIndex(x => x.id == idObj)) !== -1) {
        if (id > 0) {
          document.getElementById('save_itinerary').disabled = false;
          SwapShelters(id-1, id);
        }
      } 
    } else if (target.tagName === 'BUTTON' && target.value == "Down") {
      let id;
      if ((id = newPointsData.findIndex(x => x.id == idObj)) !== -1) {
        if (id < newPoints.getLength()- 1) {
          document.getElementById('save_itinerary').disabled = false;
          SwapShelters(id, id+1);
        }
      } 
    }
  })
  document.getElementById('shelters').appendChild(div);
}

function SwapShelters(id_1, id_2) {
  const el_1 = document.getElementById(''+ newPointsData[id_1].id);
  const el_2 = document.getElementById('shelters').replaceChild(el_1, document.getElementById(''+ newPointsData[id_2].id));
  el_1.before(el_2);
  const coord_1 = (newPoints.getArray()[id_1].getGeometry().getCoordinates());
  const coord_2 = (newPoints.getArray()[id_2].getGeometry().getCoordinates());
  newPoints.getArray()[id_1].setGeometry(new Point(coord_2));
  newPoints.getArray()[id_2].setGeometry(new Point(coord_1));
  newPointsData[id_1] = newPointsData.splice(id_2, 1, newPointsData[id_1])[0]
  console.log(newPointsData);
  if (id_1 > 0) {
    const c_1 = to4326(newPoints.getArray()[id_1-1].getGeometry().getCoordinates());
    const c_2 = to4326(newPoints.getArray()[id_1].getGeometry().getCoordinates());
    let str = url_osrm_route + c_1[0] + ',' + c_1[1] + ';' + c_2[0] + ',' + c_2[1];
    fetch(str).then(function(r) {
      if (r.status >= 200 && r.status < 300) return r.json();
    }).then(function(j) {
      if (!j) return;
      const route = new Polyline({
        factor: 1e5,
      }).readGeometry(j.routes[0].geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      polylines.getArray()[id_1-1].setGeometry(route);
      return;
    })
  }
  if (id_2 < newPointsData.length - 1) {
    const c_1 = to4326(newPoints.getArray()[id_2].getGeometry().getCoordinates());
    const c_2 = to4326(newPoints.getArray()[id_2+1].getGeometry().getCoordinates());
    let str = url_osrm_route + c_1[0] + ',' + c_1[1] + ';' + c_2[0] + ',' + c_2[1];
    fetch(str).then(function(r) {
      if (r.status >= 200 && r.status < 300) return r.json();
    }).then(function(j) {
      if (!j) return;
      const route = new Polyline({
        factor: 1e5,
      }).readGeometry(j.routes[0].geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      polylines.getArray()[id_2].setGeometry(route);
      return;
    })
  }
  return
}

function DisplayShelters() {
  let getShelters = HOST + '/shelter/getAll';
  fetch(getShelters).then(function(r) {
    if (r.status >= 200 && r.status < 300) return r.json();
  }).then(function(json) {
    if (!json) return;
      shelterSourse.clear();
      for (let i = 0; i < json.shelters.length; i++) {
        const point = new Feature({
          geometry: new Point(fromLonLat([json.shelters[i].longitude, json.shelters[i].latitude])),
        })
        shelters.push(point);
        sheltersData.push(json.shelters[i]);
      }
      console.log(json.shelters.length, newPoints.getLength(), newPointsData.length);
      return;   
  })
}
const draw = new Draw({
  source: shelterSourse,
  type: 'Point',
  finishCondition: function(e) {
    let id;
    if ((id = shelters.getArray().findIndex((x) => x.getGeometry().getCoordinates()[0] == e.coordinate[0] && x.getGeometry().getCoordinates()[1] == e.coordinate[1])) !== -1) {
      document.getElementById('save_itinerary').disabled = false;
      if (newPointsData.findIndex((x) => x.id == sheltersData[id].id) === -1) {
        AddPoint(id);
      } else {
        DeletePoint(newPointsData.findIndex((x) => x.id == sheltersData[id].id));
      }
    }
    return false;
  }
});
const snap = new Snap({
  source: shelterSourse
});
map.addInteraction(draw);
map.addInteraction(snap);


function to4326(coord) {
  return transform([
    parseFloat(coord[0]), parseFloat(coord[1])
  ], 'EPSG:3857', 'EPSG:4326');
}

function DeletePoint(id) {
  if (id === 0) {
    polylines.removeAt(id);
  } else if (id === newPointsData.length-1) {
    polylines.removeAt(id-1);
  } else {
    const coords_1 = to4326(newPoints.getArray()[id-1].getGeometry().getCoordinates());
    const coords_2 = to4326(newPoints.getArray()[id+1].getGeometry().getCoordinates());
    let str = url_osrm_route + coords_1[0] + ',' + coords_1[1] + ';' + coords_2[0] + ',' + coords_2[1];
    fetch(str).then(function(r) {
      if (r.status >= 200 && r.status < 300) return r.json();
    }).then(function(j) {
      if (!j) return;
      const route = new Polyline({
        factor: 1e5,
      }).readGeometry(j.routes[0].geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      polylines.getArray()[id-1].setGeometry(route);
      polylines.removeAt(id);
      return;
    })
  }
  newPoints.removeAt(id);
  document.getElementById(''+newPointsData[id].id).remove();
  newPointsData.splice(id, 1);
}

function AddPoint(id) {
  const f = new Feature({
    geometry: new Point(shelters.getArray()[id].getGeometry().getCoordinates()),
  })
  newPoints.push(f);
  newPointsData.push({
    id: sheltersData[id].id,
    obj: f
  });
  if (newPointsData.length > 1) {
    console.log(newPointsData[newPointsData.length - 2].obj);
    const coords_1 = to4326(newPointsData[newPointsData.length - 2].obj.getGeometry().getCoordinates());
    const coords_2 = to4326(newPointsData[newPointsData.length - 1].obj.getGeometry().getCoordinates());
    let str = url_osrm_route + coords_1[0] + ',' + coords_1[1] + ';' + coords_2[0] + ',' + coords_2[1];
    fetch(str).then(function(r) {
      if (r.status >= 200 && r.status < 300) return r.json();
    }).then(function(j) {
      if (!j) return;
      const route = new Polyline({
        factor: 1e5,
      }).readGeometry(j.routes[0].geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      const feature = new Feature({
        type: 'route',
        geometry: route
      })
      polylines.push(feature);
      return;
    })
  }
  AddElementIntoDocument(sheltersData[id].id);
}

function DisplayItinerary(itinerary) {
  let geIitineraryPoints = HOST + '/itinerary/get/'+itinerary;
  fetch(geIitineraryPoints).then(function(r) {
    if (r.status >= 200 && r.status < 300) return r.json();
  }).then(function(json) {
    if (!json) return;
    polylines.clear();
    for (let i = 1; i < json.shelters.length; i++) {
      setTimeout(() => {
        AddPoint(sheltersData.findIndex((x) => x.id == json.shelters[i].id));
        console.log("тута " + i)
      }, 200 * i + 1)
    }
    return; 
  })
}

document.getElementById('save_itinerary').addEventListener('click', () => {
  UpdateData(localStorage.getItem("id_itinerary"));
})

function UpdateData(id) {
  
  let obj = {
    shelters: []
  }
  newPointsData.forEach(element => {
    obj.shelters.push({
      id: element.id,
    })
  });
  let str = HOST + `/itinerary/addPoints/${id}/${token}`;
  fetch(str, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(obj)
  }).then(function(r) {
    if (r.status >= 200 && r.status < 300) return r.json();
  }).then(function(json) {
    if (!json) return;
    if (json.isError) {
      console.log(json.message);
    } else {
      console.log('yes')
      window.open('./itinerary.html', '_self')
    }
  })
}