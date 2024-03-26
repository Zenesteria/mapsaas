import { Box, Button, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { demographicData } from "../types/interface";
import {
  getLgaDataSet,
  getLgaDataSetDev,
  getStateDataSet,
  getStateDataSetDev,
} from "../util/pipeline";
import { database } from "../config/firebase/firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { bodyProps } from "./api/updatePollingData";
import Authenticate from "@/components/Authenticate";
import Link from "next/link";
import {auth} from '@/config/firebase/firebaseConfig'
import { isAdmin } from "@/util/auxdata";

interface pageProps {
  statespollingdata: demographicData[];
}

export default function PollingForm({ statespollingdata }: pageProps) {
  console.log(isAdmin)
  const uid = auth.currentUser?.uid
  const [data, setData] = useState({
    state: "",
    lga: "",
    ward: "",
    pollingUnit: "",
    result:statespollingdata[4].alldata?.length?statespollingdata[4].alldata[0].wards[0].units[0].result.map((e) => {
        return{
          id:e.id,
          val:0
        }
    }):[{
      id:'',
      val:0
    }]
  });
  const [defaultState,setDefaultState] = useState(true);
  const lgas = statespollingdata.filter((state) => {
    return state.loc == data.state;
  });
  const wards =
    lgas.length > 0
      ? lgas[0].alldata?.filter((lga) => {
          return lga.name == data.lga;
        })
      : [];
  const pollingUnits = wards?.length
    ? wards[0].wards.filter((ward) => {
        return ward.name == data.ward;
      })
    : [];
      const unit = pollingUnits.length>0? pollingUnits[0].units.filter((unit) => {
        return unit.id == data.pollingUnit;
      }):[];
  useEffect(() => {
    // console.log(lgas)
    // console.log(data.result);
    // console.log(pollingUnits[0]);
  },[]);

  const handleUpdate = async () => {
      const body:bodyProps = {
        state:data.state,
        lga:data.lga,
        pollingUnit:data.pollingUnit,
        result:data.result,
        wards:wards?.length?wards[0].wards:[]
      }
      try {
        const updateData = await fetch('/api/updatePollingData',{
          method:'POST',
          headers:{
            'Content-type':'application/json'
          },
          body:JSON.stringify(body)
        } )
        console.log(updateData.json())
      } catch (error) {
        console.log(error)
      }
  } 
  return (
    <Authenticate>
      <HStack className="flex-wrap">
        <div className="flex flex-col min-w-[300px] flex-1 items-center justify-center h-screen">
          <form
            action=""
            className="w-[60%] min-w-[250px] flex flex-col duration-500 justify-around h-[30%]"
          >
            <div className="flex w-full items-center">
              <Text w={"150px"} flex={"0.4"} mr={"3"}>
                State:
              </Text>

              <Select
                onChange={(e) => {
                  setData({
                    state: e.target.value,
                    lga: "",
                    ward: "",
                    pollingUnit: "",
                    result: data.result,
                  });
                }}
                flex={"1"}
              >
                {!data.state ? (
                  <option value="default">
                    {"<------- Select A State -------->"}
                  </option>
                ) : null}
                {statespollingdata.map((state, index) => {
                  return (
                    <option key={`${index}inputState`} value={state.loc}>
                      {state.loc}
                    </option>
                  );
                })}
              </Select>
            </div>
            {lgas?.length ? (
              <div className="flex items-center">
                <Text w={"150px"} flex={"0.4"} mr={"3"}>
                  LGA:
                </Text>

                <Select
                  onChange={(e) => {
                    setData((prev) => {
                      return {
                        state: prev.state,
                        lga: e.target.value,
                        ward: "",
                        pollingUnit: "",
                        result: prev.result,
                      };
                    });
                  }}
                  flex={"1"}
                  value={data.lga}
                >
                  {!data.lga ? (
                    <option value="">{"<------- Select LGA -------->"}</option>
                  ) : null}
                  {lgas[0].alldata?.map((lga, index) => {
                    return (
                      <option key={`${index}Lga`} value={lga.name}>
                        {lga.name}
                      </option>
                    );
                  })}
                </Select>
              </div>
            ) : null}
            {wards?.length ? (
              <div className="flex items-center">
                <Text w={"150px"} flex={"0.4"} mr={"3"}>
                  WARD:
                </Text>

                <Select
                  onChange={(e) => {
                    setData((prev) => {
                      return {
                        state: prev.state,
                        lga: prev.lga,
                        ward: e.target.value,
                        pollingUnit: "",
                        result: prev.result,
                      };
                    });
                  }}
                  flex={"1"}
                  value={data.ward}
                >
                  {!data.ward ? (
                    <option value="">{"<------- Select Ward -------->"}</option>
                  ) : null}
                  {wards[0]?.wards?.map((ward, index) => {
                    return (
                      <option key={`${index}Ward`} value={ward.name}>
                        {ward.name}
                      </option>
                    );
                  })}
                </Select>
              </div>
            ) : null}

            {data.ward && pollingUnits.length > 0 ? (
              <div className="flex items-center">
                <Text w={"150px"} flex={"0.45"} mr={"3"}>
                  Polling Unit ID:
                </Text>

                <Select
                  onChange={(e) => {
                    setData((prev) => {
                      return {
                        state: prev.state,
                        lga: prev.lga,
                        ward: prev.ward,
                        pollingUnit: e.target.value,
                        result: prev.result,
                      };
                    });
                  }}
                  flex={"1"}
                  value={data.pollingUnit}
                >
                  {!data.pollingUnit ? (
                    <option value="">
                      {"<------- Select Polling Unit -------->"}
                    </option>
                  ) : null}
                  {pollingUnits[0].units.map((unit, index) => {
                    return (
                      <option key={`${index}Ward`} value={unit.id}>
                        {unit.id}
                      </option>
                    );
                  })}
                </Select>
              </div>
            ) : null}
          </form>
        </div>
        <VStack p={4} flex={1} h="100vh">
          {data.pollingUnit ? (
            <div className="flex flex-col items-center">
              <Text>Results</Text>
              {unit[0].result.map((res, index) => {
                return (
                  <div key={`${index}Result`} className="flex">
                    <Text>{res.id}</Text>
                    <Input
                      placeholder={`${res.val}`}
                      onChange={(e) => {
                        setDefaultState(false);
                        setData((prev) => {
                          let itemIndex = data.result
                            .map((e) => e.id)
                            .indexOf(res.id);
                          let resCont = [...data.result];
                          resCont[itemIndex].val = parseInt(e.target.value);

                          // console.log(resCont)
                          // console.log(data.result)
                          // let condition = itemIndex||res.id==
                          return {
                            state: prev.state,
                            lga: prev.lga,
                            ward: prev.ward,
                            pollingUnit: prev.pollingUnit,
                            result: resCont,
                          };
                        });
                        console.log(data.result);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          {!defaultState ? (
            <Button
              onClick={handleUpdate}
              bg={"red.700"}
              w={"fit-content"}
              mx={"auto"}
              my={"7"}
              p={"7"}
              fontWeight={"bold"}
              color={"white"}
            >
              Update
            </Button>
          ) : null}
          <Box mt={"auto"}>
            {isAdmin() ? (
              <Link href={`/temp/${uid}/user/users`}>
                <Button bg={'black'} color='white' _hover={{}}>
                  View Agents
                </Button>
              </Link>
            ) : null}
          </Box>
        </VStack>
      </HStack>
    </Authenticate>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const dev = process.env.NODE_ENV == "development";

  if (!dev) {
    const statespollingdata = await getStateDataSet();
    // const lgapollingdata = await getLgaDataSet();
    return {
      props: { statespollingdata },
    };
  }

  const statespollingdata = getStateDataSetDev();
  // const lgapollingdata = getLgaDataSetDev();
  return {
    props: { statespollingdata },
    revalidate:60,
  };
};
