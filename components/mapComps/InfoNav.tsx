import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { statesdata } from "../../config/dataScripts";

import {
  setOrder,
  setActive,
  resetActive,
  fullReset,
} from "../../redux/mapSlice";
import {
  displayInfo,
  resetData,
  setData,
  toggleInfo,
} from "../../redux/infoSlice";
import { demographicData } from "../../types/interface";
import { Box, useColorModeValue, Text, Select, Flex } from "@chakra-ui/react";

export default function InfoNav({
  statesdataset,
}: {
  statesdataset: demographicData[];
}) {
  const mapState = useSelector((state: RootState) => {
    return state.map;
  });
  const dispatch = useDispatch();
  const [isDefault, setIsDefault] = useState(true);

  const orders: RootState["map"]["order"][] = [
    "state",
    "geo-political-zone",
    "senatorial",
    "federal",
  ];

  const state = statesdata.filter((state) => {
    return state.name == mapState.active.state;
  });
  const zones: RootState["map"]["active"]["zone"][] = [
    "North-Central",
    "North-East",
    "North-West",
    "South-East",
    "South-South",
    "South-West",
  ];

  const handleStateChange = (e: any) => {
    const active: string = e.target.value;
    const currentData = statesdataset.filter((state) => {
      return state.loc.toLowerCase() == active.toLowerCase();
    })[0];
    if (isDefault) {
      setIsDefault(false);
    }
    const coordinates = statesdata.filter((state) => {
      return state.name == active;
    })[0].loc;

    dispatch(toggleInfo());
    dispatch(resetActive());
    dispatch(
      setActive({
        state: active,
        bound: coordinates,
      })
    );

    dispatch(
      setData({
        name: active,
        sqm: 0,
        geozone: "N/A",
        total: {
          voters: 0,
          wards: currentData.wards,
          pollingUnits: currentData.units,
        },
        pollingData: currentData.result,
      })
    );
  };

  const handleSenatorialChange = (e: any) => {
    dispatch(toggleInfo());
    dispatch(resetData());
    dispatch(
      setActive({
        lga: e.target.value,
        bound: statesdata.filter((state) => {
          return state.name == mapState.active.state;
        })[0].loc,
      })
    );
  };

  const handleFederalChange = (e: any) => {
    const fedData = statesdata
      .filter((state) => {
        return state.name.toLowerCase() == mapState.active.state.toLowerCase();
      })[0]
      .federalConstituencies.filter((fed) => {
        return fed.name == e.target.value;
      })[0]
      .lgas.map((lga) => {
        return statesdataset
          .filter((state) => {
            return (
              state.loc.toLowerCase() == mapState.active.state.toLowerCase()
            );
          })[0]
          .alldata?.filter((lgadata) => {
            return lgadata.name.toLowerCase() == lga.toLowerCase();
          })[0];
      });
    dispatch(toggleInfo());
    dispatch(resetData());
    dispatch(
      setData({
        name: `${e.target.value.split("_").join(" ")} Constituency`,
        sqm: "N/A",
        total: {
          voters: 0,
          wards: fedData
            .map((data) => {
              return data?.wards.length;
            })
            .reduce((total, current) => {
              return (total || 0) + (current || 0);
            }),
          pollingUnits: fedData
            .map((data) => {
              let val: number[] = [];
              data?.wards.map((ward) => {
                val.push(ward.units.length);
              });
              return val.reduce((total, current) => {
                return (total || 0) + (current || 0);
              });
            })
            .reduce((total, current) => {
              return (total || 0) + (current || 0);
            }),
        },
      })
    );
    dispatch(
      setActive({
        lga: e.target.value,
        bound: statesdata.filter((state) => {
          return state.name == mapState.active.state;
        })[0].loc,
      })
    );
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(fullReset());
    dispatch(resetData());
    dispatch(
      setActive({
        zone: e.target.value,
        bound: [9.67475603288972, 7.287066434953559],
      })
    );
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value;
    if (order != "geo-political-zone") {
      dispatch(setOrder({ order: e.target.value }));
      dispatch(resetActive());
      dispatch(resetData());
      return;
    }
    dispatch(setOrder({ order: e.target.value }));
    dispatch(fullReset());
    dispatch(resetData());
  };
  const bg = useColorModeValue("brand.lightSub", "brand.darkMain");

  useEffect(() => {
    mapState.active.state.length > 0 ? setIsDefault(false) : setIsDefault(true);
  }, [mapState]);
  return (
    <Box bg={bg} className="bg-white mb-5 rounded-xl">
      <div className="px-5 py-7">
        {/* <h1
          className="font-semibold"
          style={{ fontSize: "calc(0.8rem + 0.5vw)" }}
        >
          Filters
        </h1> */}

        <div className="flex justify-between my-2">
          <Select
            disabled={mapState.order == "geo-political-zone" ? true : false}
            flex={1}
            mr={"5"}
            style={{
              backgroundColor:
                mapState.order == "geo-political-zone"
                  ? "rgb(200,200,200)"
                  : "transparent",
            }}
            value={mapState.active.state}
            onChange={handleStateChange}
          >
            {isDefault ? <option value={""}>Select a state</option> : null}
            {statesdata.map((state, index) => {
              return (
                <option key={`${index}opt`} value={state.name}>
                  {state.name}
                </option>
              );
            })}
          </Select>

          <Box flex={1} position={"relative"}>
            <Text
              bg={bg}
              zIndex={900}
              className="absolute text-[0.7rem] top-[-8px] font-light left-[10px] px-2"
            >
              Sort by:
            </Text>
            <Select
              onChange={handleOrderChange}
              value={mapState.order}
              borderRadius={"lg"}
            >
              {orders.map((order, index) => {
                return (
                  <option value={order} key={`${index}order`}>
                    {order[0].toUpperCase() + order.slice(1)}
                  </option>
                );
              })}
            </Select>
          </Box>
        </div>

        {mapState.order == "senatorial" && state.length != 0 ? (
          <div className="relative w-full">
            <p className="absolute text-[0.7rem] bg-white top-0 font-light left-[10px] px-2">
              {mapState.order} districts
            </p>
            <select
              className="w-full bg-transparent border font-light p-2 rounded-lg my-2"
              value={mapState.active.lga}
              onChange={handleSenatorialChange}
            >
              {mapState.active.lga.length == 0 ? (
                <option value="">
                  {"----Select Senatorial District-----"}
                </option>
              ) : null}
              {state[0].senatorialDistricts.map((senate, index) => {
                return (
                  <option key={`${index}senat`} value={`${senate.name}`}>
                    {senate.name}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null}

        {mapState.order == "federal" && state.length != 0 ? (
          <div className="relative w-full">
            <Text
              bg={bg}
              className="absolute text-[0.7rem] top-0 font-light left-[10px] px-2"
            >
              {mapState.order} constituency
            </Text>
            <select
              className="w-full bg-transparent border font-light p-2 rounded-lg my-2"
              value={mapState.active.lga}
              onChange={handleFederalChange}
            >
              {mapState.active.lga.length == 0 ? (
                <option value="">
                  {"----Select Federal Constituency-----"}
                </option>
              ) : null}
              {state[0].federalConstituencies.map((federal, index) => {
                return (
                  <option key={`${index}senat`} value={`${federal.name}`}>
                    {federal.name.split("_").join(" ")}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null}

        {mapState.order == "geo-political-zone" ? (
          <div className="relative w-full mt-4">
            <Text
              bg={bg}
              className="absolute text-[0.7rem] top-0 font-light left-[10px] px-2"
            >
              {mapState.order}s
            </Text>
            <Select
              className="w-full border font-light p-2 rounded-lg my-2"
              value={mapState.active.zone}
              onChange={handleZoneChange}
            >
              {zones.map((zone, index) => {
                return (
                  <option key={`${index}zones`} value={`${zone}`}>
                    {zone}
                  </option>
                );
              })}
            </Select>
          </div>
        ) : null}
      </div>
    </Box>
  );
}

const OrderBtn = ({ order }: { order: "state" | "senatorial" | "federal" }) => {
  const mapState = useSelector((state: RootState) => {
    return state.map;
  });
  const dispatch = useDispatch();
  const handleClick = () => {
    if (order == "state") {
      // dispatch(setActive())
    }
    dispatch(resetActive());
    dispatch(resetData());
    dispatch(
      setOrder({
        order,
      })
    );
  };
  return (
    <div
      onClick={handleClick}
      className="py-2 px-7 text-[0.7rem] cursor-pointer mx-4 rounded-lg text-green-700 bg-slate-300 hover:bg-green-700 hover:text-slate-300 duration-200"
      style={
        order == mapState.order
          ? {
              backgroundColor: "rgb(21 128 61)",
              color: "rgb(203 213 225)",
            }
          : {}
      }
    >
      <h1 className="font-bold">{order.toUpperCase()}</h1>
    </div>
  );
};
