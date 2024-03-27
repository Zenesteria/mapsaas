import React, { useEffect } from "react";
import { geojson } from "../../config/statesgeojson";
import State from "./State";
import { demographicData } from "../../types/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// import publickSchoolGeoJson from '../config/abj/public-schools.json' assert {type:'json'}

interface compProps {
  dataState: geojson;
  dataset: demographicData[];
}

export default function PolygonComp({ dataState, dataset }: compProps) {
  const mapState = useSelector((state: RootState) => {
    return state.map;
  });
  const filteredState = dataState.features.filter((state) => {
    return state.properties.geozone == mapState.active.zone;
  });

  useEffect(() => {
    // console.log(fetchData())
  });

  return (
    <div>
      {mapState.order == "state" ||
      mapState.order == "senatorial" ||
      mapState.order == "federal"
        ? dataState.features.map((state, index) => {
            const coordinates: any = state.geometry.coordinates[0].map(
              (item: any) => {
                return [item[1], item[0]];
              }
            );
            return (
              <State
                key={index}
                coordinates={coordinates}
                name={[state.properties.admin1Name, state.properties.geozone]}
                dataSet={
                  dataset.filter((result) => {
                    return state.properties.admin1Name == result.loc;
                  })[0]
                }
                sqm={state.properties.sqm}
              />
            );
          })
        : null}

      {/* GEOZONES */}
      {mapState.order == "geo-political-zone"
        ? dataState.features.map((state, index) => {
            const coordinates: any = state.geometry.coordinates[0].map(
              (item: any) => {
                return [item[1], item[0]];
              }
            );
            return (
              <State
                key={index}
                active={filteredState.indexOf(state) != -1}
                coordinates={coordinates}
                name={[state.properties.admin1Name, state.properties.geozone]}
                dataSet={
                  dataset.filter((result) => {
                    return state.properties.admin1Name == result.loc;
                  })[0]
                }
                sqm={state.properties.sqm}
              />
            );
          })
        : null}
    </div>
  );
}
