import React from "react";
import { useSelector } from "react-redux";
import { lgageojson } from "../../config/lgageojson";
import { RootState } from "../../redux/store";
import { demographicData } from "../../types/interface";
// import { getLgaDataSet } from '../util/pipeline'
import Lga from "./Lga";

interface compProps {
  dataLga: lgageojson;
  dataset: demographicData[];
}

export default function PolygonComp({ dataLga, dataset }: compProps) {
  const mapState = useSelector((state: RootState) => {
    return state.map;
  });
  let filteredLga = dataLga.features.filter((lga) => {
    return lga.properties.admin1Name == mapState.active.state;
  });
  // console.log(dataset)
  if (mapState.active.lga.length != 0) {
    switch (mapState.order) {
      case "senatorial":
        filteredLga = dataLga.features.filter((lga) => {
          return (
            lga.properties.admin3Name == mapState.active.lga ||
            lga.properties.admin2Name == mapState.active.lga
          );
        });
        break;
      case "federal":
        filteredLga = dataLga.features.filter((lga) => {
          return (
            lga.properties.admin4Name == mapState.active.lga ||
            lga.properties.admin2Name == mapState.active.lga
          );
        });
        break;

      default:
        // filteredLga = dataLga.features.filter(lga => {return lga.properties.admin1Name == mapState.active.state})
        break;
    }
  }

  // const dataSet = getLgaDataSet()

  return (
    <div>
      {mapState.order != "state" ? (
        filteredLga?.map((lga, index) => {
          const coordinates: any = lga.geometry.coordinates[0][0].map(
            (item: any) => {
              return [item[1], item[0]];
            }
          );
          return (
            <Lga
              key={index}
              active={filteredLga.indexOf(lga) != -1}
              coordinates={coordinates}
              name={[
                lga.properties.admin1Name,
                lga.properties.admin2Name,
                lga.properties.admin3Name,
              ]}
              dataSet={
                dataset.filter((result) => {
                  return lga.properties.admin2Name == result.loc;
                })[0]
              }
            />
          );
        })
      ) : (
        <div></div>
      )}
      {/* {mapState.order != 'state'?dataLga.features.map((lga, index) => {
          const coordinates:any =  lga.geometry.coordinates[0][0].map((item:any) => {
            return [item[1], item[0]]
          })
          return(
              <Lga
                  key={index}
                  active={filteredLga.indexOf(lga) != -1}
                  coordinates={coordinates}
                  name={[lga.properties.admin1Name,lga.properties.admin2Name,lga.properties.admin3Name]}
                  dataSet={dataset.filter(result => {return lga.properties.admin2Name == result.loc})[0]}
              />
          )
        }):<div></div>} */}
    </div>
  );
}
