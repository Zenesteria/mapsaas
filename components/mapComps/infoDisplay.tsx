import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { demographicData } from "../../types/interface";
import { generateReportData } from "../../util/ExcelGenerator";
import InfoNav from "./InfoNav";
import ReportGenerator from "./ReportGenerator";
import { dataThemes } from "../../util/dataThemes";

import { Box, Button, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export default function InfoDisplay({
  dataset,
}: {
  dataset: demographicData[];
}) {
  const infoState = useSelector((state: RootState) => {
    return state.info;
  });
  const mapState = useSelector((state: RootState) => {
    return state.map;
  });

  const unfilteredReportData = !mapState.active.lga
    ? dataset.filter((state) => {
        return state.loc == mapState.active.state;
      })[0]?.alldata
    : dataset
        .filter((state) => {
          return state.loc == mapState.active.state;
        })[0]
        ?.alldata?.filter((lga) => {
          return lga.name == mapState.active.lga;
        });

  const reportData = generateReportData(unfilteredReportData || []);

  const total = infoState.data.pollingData? infoState.data.pollingData.map(data => {return data.val}).reduce((total, current) => {return total + current},0):0

  const bg = useColorModeValue("brand.lightSub", "brand.darkMain");
  return (
    <Box className="flex mx-3 overflow-y-auto flex-1 md:max-w-[350px] flex-col h-screen md:h-full min-w-[330px]">
      <InfoNav statesdataset={dataset} />

      <Box bg={bg} className="h-full rounded-xl overflow-y-auto cusScrollbar">
        {infoState.data.name ? (
          <div className="px-5 py-7">
            <div className="flex flex-wrap-reverse justify-between items-center w-full">
              <h1
                className="font-semibold tracking-wide my-3 flex-1 min-w-[250px]"
                style={{ fontSize: "calc(1rem + 0.5vw)" }}
              >
                {infoState.data.name}{" "}
                <span className="mx-2 font-light text-[0.8rem] after:absolute relative after:content-['2'] after:text-[0.5rem] after:right-[-10%] after:top-[-0.2rem]">{`${
                  infoState.data.sqm ? infoState.data.sqm : ""
                }km`}</span>
              </h1>

              <ReportGenerator
                reportName={
                  !mapState.active.lga
                    ? mapState.active.state
                    : mapState.active.lga
                }
                data={reportData}
              />
            </div>

            {mapState.order == "senatorial" || mapState.order == "federal" ? (
              <div>
                <div className="m-2 flex-[0.8] min-w-[100px] text-center bg-gradient-to-br from-[#4269B4] to-[#C05467] px-4 pt-4 rounded-lg text-white">
                  <p className="mx-auto mb-1 w-fit font-black">
                    {`${
                      infoState.data.total.wards
                        ? infoState.data.total.wards
                        : "N/A"
                    }`}
                  </p>
                  <p className="text-[0.6rem] mb-2">Wards:</p>
                </div>
                <div className="m-2 flex-1 text-center min-w-[100px] bg-gradient-to-bl from-[#4269B4] to-[#C05467] px-4 pt-4 rounded-lg text-white">
                  <p className="mx-auto mb-1 w-fit font-black">
                    {`${
                      infoState.data.total.pollingUnits
                        ? infoState.data.total.pollingUnits
                        : "N/A"
                    }`}
                  </p>
                  <p className="text-[0.5rem] mb-2">Polling Units:</p>
                </div>
              </div>
            ) : (
              <div className="px-5 w-full">
                {infoState.data.geozone ? (
                  <h3 className="my-4 tracking-wide font-light">
                    Geo Political Zone:{" "}
                    <span className="font-bold">{infoState.data.geozone}</span>
                  </h3>
                ) : null}

                <div className="w-full my-7">
                  {infoState.data.pollingData
                    ? infoState.data.pollingData.map((data, index) => {
                        return (
                          <div
                            key={`${index}data ${data.val}`}
                            className="flex items-center w-full my-4 min-w-[150px]"
                          >
                            <p className="flex-[0.3] font-bold w-fit mr-2">
                              {data.id}
                            </p>
                            <div className="flex-1 left-0 h-[12px] relative rounded-full overflow-hidden bg-blue-100 items-start text-white flex item justify-center w-full min-w-[150px]">
                              <div
                                className="absolute left-0 h-full rounded-full"
                                style={{
                                  width: `${(data.val / total) * 100}%`,
                                  backgroundColor: dataThemes.filter(
                                    (theme) => {
                                      return theme.id == data.id;
                                    }
                                  )[0].high,
                                }}
                              ></div>
                            </div>
                            <p className="flex-[0.3] text-center text-[0.8rem] tracking-wider">
                              {data.val}
                            </p>
                          </div>
                        );
                      })
                    : null}
                </div>

                <div className="w-full h-fit">
                  <div className="h-fit min-h-[12vh]">
                    <h1 className="w-fit font-semibold relative">Metrics</h1>
                    <div className="flex flex-wrap overflow-x-auto overflow-y-hidden justify-around text-[0.7rem] my-2">
                      {!mapState.active.lga ? (
                        <div className="m-2 flex-[0.8] min-w-[100px] text-center bg-gradient-to-br from-[#4269B4] to-[#C05467] px-4 pt-4 rounded-lg text-white">
                          <p className="mx-auto mb-1 w-fit font-black">
                            {`${
                              unfilteredReportData
                                ? unfilteredReportData.length
                                : "N/A"
                            }`}
                          </p>
                          <p className="text-[0.6rem] mb-2">LGAs:</p>
                        </div>
                      ) : null}
                      <div className="m-2 flex-[0.8] min-w-[100px] text-center bg-gradient-to-br from-[#4269B4] to-[#C05467] px-4 pt-4 rounded-lg text-white">
                        <p className="mx-auto mb-1 w-fit font-black">
                          {`${
                            infoState.data.total.wards
                              ? infoState.data.total.wards
                              : "N/A"
                          }`}
                        </p>
                        <p className="text-[0.6rem] mb-2">Wards:</p>
                      </div>

                      <div className="m-2 flex-1 text-center min-w-[100px] bg-gradient-to-bl from-[#4269B4] to-[#C05467] px-4 pt-4 rounded-lg text-white">
                        <p className="mx-auto mb-1 w-fit font-black">
                          {`${
                            infoState.data.total.pollingUnits
                              ? infoState.data.total.pollingUnits
                              : "N/A"
                          }`}
                        </p>
                        <p className="text-[0.5rem] mb-2">Polling Units:</p>
                      </div>

                      <div className="m-2 flex-[0.8] text-center bg-gradient-to-br to-[#4269B4] from-[#C05467] px-4 pt-4 rounded-lg text-white">
                        <p className="mx-auto mb-1 w-fit font-black">
                          {`${"N/A"}`}
                        </p>
                        <p className="text-[0.6rem] mb-2">Voters:</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <h1 className="w-full h-full justify-center flex items-center tracking-widest font-light italic">
            Select Location
          </h1>
        )}
        
      </Box>
      
    </Box>
  );
}
