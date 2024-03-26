import CountdownTimer from "@/components/Countdown";
// import HomeBtn from "@/components/HomeBtn";
import { auth, storage } from "@/config/firebase/firebaseConfig";
import { Candidate } from "@/types/Schemas/Candidate";
import { guarantor } from "@/types/Schemas/Guarantor";
import { server } from "@/util/Server";
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Field, Form, Formik, FormikProps } from "formik";
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";

interface pageProps {
  guarantor: guarantor;
  user: Candidate["documentData"];
}

const Guarantor: NextPage<pageProps> = ({ user, guarantor }: pageProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();
  const [pic, setPic] = useState();
  function handleChange(e: any) {
    if (window.FileList && window.File) {
      const picData = e.target.files[0];
      setPic(e.target.files[0]);
      const pfp: any = document.getElementById("profilePic");
      const mainpfp: any = document.getElementById("mainPfp");
      // Check if the file is an image.
      if (picData.type && !picData.type.startsWith("image/")) {
        console.log("File is not an image.", picData.type, picData);
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", (event: any) => {
        pfp.style.backgroundImage = `url('${event.target.result}')`;
        mainpfp.style.backgroundImage = `url('${event.target.result}')`;
      });
      reader.readAsDataURL(picData);
    }
  }

  useEffect(() => {
    // console.log(user);
  });
  return (
    <VStack p={7}>
      <div className="w-full">
        <CountdownTimer targetDate={`${guarantor.link.expDate}`} />
      </div>
      {!guarantor.completed ? (
        <VStack
          p={7}
          pos="relative"
          className=" w-[60%] min-w-[300px] shadow-2xl border-2"
        >
          {/* <div
            className="absolute w-full h-full top-0 right-0 z-[1] opacity-30 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://www.crwflags.com/fotw/images/n/ng_ndlea.gif')`,
            }}
          ></div> */}
          <Box pos={"relative"} zIndex="10" w={"full"}>
            <HStack flexWrap={"wrap"} w={"full"}>
              <Box minH="100px" minW={"70px"} flex={0.6}>
                <Text
                  color={"white"}
                  style={{ fontSize: "50%" }}
                  casing="uppercase"
                  bg="black"
                >
                  {`${guarantor.link.uuid}`}
                </Text>
              </Box>
              <VStack
                textAlign={"center"}
                minW={"200px"}
                minH={"100px"}
                flex={1}
              >
                <div className="w-[50%]">{/* <HomeBtn /> */}</div>
                <Text style={{fontSize:'calc(1rem + 1vw)'}} fontWeight={"bold"} casing={"capitalize"}>
                  Polling Agent Registration Form
                </Text>
              </VStack>
              <VStack
                minW={"100px"}
                p={3}
                minH="100px"
                rounded={"xl"}
                flex={0.6}
              >
                <div
                  className="w-full aspect-square bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg')`,
                  }}
                ></div>
              </VStack>
            </HStack>
            <VStack alignItems={"start"}>
              <Heading
                style={{ fontSize: "calc(1rem + 0.5vw)" }}
                mb={4}
                textDecoration={"underline"}
              >
                IMPORTANT!
              </Heading>
              <Text style={{ fontSize: "calc(0.5rem + 0.5vw)" }}>
                {`This recruitment exercise requires that a candidate seeking
                appointment must produce two (2) credible, responsible and
                acceptable persons as guarantors. If you are willing to stand as
                guarantor for this applicant, kindly complete this form in your
                own handwriting. Please Note that it is very dangerous to stand
                as guarantor for persons whom you do not know well. Acceptable
                Guarantors Include: Traditional Rulers, Magistrates, Local
                Government Chairman, Heads of Education Institutions attended
                (Principals, Rectors, Provosts and Vice Chancellors), Career
                Civil Servants not below the rank of Grade Level 12, NDLEA
                Officer not below the rank of Superintendent of Narcotics (SN),
                Paramilitary or Military officers of equivalent rank.`}
              </Text>
              {/* <Text
                ml={"auto!important"}
                fontWeight="semibold"
                style={{ fontSize: "calc(0.7rem + 0.25vw)" }}
              >
                {`GUARANTOR A (Please attach photocopy of official ID card)`}
              </Text> */}
            </VStack>
            <Formik
              initialValues={{
                fullName: "",
                homeAddress: "",
                officeAddress: "",
                phoneNumber: "",
                email: "",
                password: "",
              }}
              onSubmit={async (value, action) => {
                let arr = user.guarantors?.map(
                  (guarantor) => guarantor.link.uuid
                );
                let indexValue = arr?.indexOf(guarantor.link.uuid);
                let newGuarantors = [...(user.guarantors || [])];

               await createUserWithEmailAndPassword(auth, value.email, value.password );
               
                newGuarantors[indexValue || 0] = {
                  firstName: value.fullName,
                  lastName: "",
                  homeAddress: value.homeAddress,
                  workAddress: value.officeAddress,
                  dateOfBirth: new Date(),
                  emailAddress: {
                    data: "",
                    verified: false,
                  },
                  phoneNumber: {
                    data: value.phoneNumber,
                    verified: false,
                  },
                  completed: true,
                  link: { ...guarantor.link },
                };
                const updateRecord = await (
                  await fetch(
                    `${server}/api/applicant/update/${router.query.uid}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-type": "application/json",
                      },
                      body: JSON.stringify({
                        guarantors: newGuarantors,
                      }),
                    }
                  )
                ).json();

                console.log(newGuarantors);
                action.setSubmitting(false);
                router.push('/login');
              }}
            >
              {(props: FormikProps<any>) => (
                <Form className="my-10">
                  <div className="flex flex-col">
                    <Text>I,</Text>
                    <Field name="fullName">
                      {({ field, form }: any) => {
                        return (
                          <FormControl mb={4} w={""}>
                            <Input
                              {...field}
                              border={""}
                              borderColor={""}
                              rounded={""}
                              w={""}
                              required
                              _focus={{}}
                              _hover={{}}
                              _active={{}}
                              outline={{}}
                              m={0}
                              className="border-b  outline-[0px] focus:outline-0 p-0 border-transparent w-full border-dashed border-black"
                            />
                          </FormControl>
                        );
                      }}
                    </Field>{" "}
                    <Text>Of Home Address,</Text>
                    <Field name="homeAddress">
                      {({ field, form }: any) => {
                        return (
                          <FormControl w={""}>
                            <Input
                              {...field}
                              border={""}
                              borderColor={""}
                              rounded={""}
                              required
                              className="border-b border-transparent border-dashed mb-1 border-black"
                            />
                          </FormControl>
                        );
                      }}
                    </Field>
                    <Text>and Office Address,</Text>
                    <Field name="officeAddress">
                      {({ field, form }: any) => {
                        return (
                          <FormControl w={""}>
                            <Input
                              {...field}
                              border={""}
                              borderColor={""}
                              rounded={""}
                              required
                              className="border-b border-transparent border-dashed mb-1 border-black"
                            />
                          </FormControl>
                        );
                      }}
                    </Field>
                    {/* <Text>
                      stand as a guarantor to (Name of Applicant){" "}
                      <span className="font-black">
                        {user.firstName} {user.lastName}{" "}
                      </span>
                      who is being considered for recruitment into the National
                      drug law enforcement agency
                    </Text> */}
                    <br />
                    <Text>My Phone Number is,</Text>
                    <Field name="phoneNumber">
                      {({ field, form }: any) => {
                        return (
                          <FormControl w={""}>
                            <Input
                              {...field}
                              border={""}
                              borderColor={""}
                              rounded={""}
                              required
                              className="border-b border-transparent border-dashed mb-1 border-black"
                            />
                          </FormControl>
                        );
                      }}
                    </Field>
                    <br />
                    <Text>
                      That I irrevocably and unconditionally guarantee to
                      indemnify the National drug law enforcement agency in the
                      event of any unpleasant development arising from the
                      candidate’s action and/or inaction before, during and
                      after the recruitment exercise. I also promise to produce
                      him/her any time he/she is needed for any reason of
                      Security/National Interest. This guarantee shall be
                      governed by the laws of the Federal Republic of Nigeria.
                    </Text>
                    <br />
                    <HStack>
                      {/* <Box w={200}>
                        <>
                          <div
                            id="mainPfp"
                            className="relative w-full mr-[4vw] aspect-square drop-shadow-lg hover:brightness-95 cursor-pointer group bg-center bg-cover bg-no-repeat"
                            onClick={onOpen}
                            style={{
                              backgroundImage: `url('/img/default.png')`,
                            }}
                          >
                            <FaCamera className="hidden group-hover:block absolute right-[5px] top-[5px] p-[0.25rem] w-[20px] h-[20px] rounded-md text-white bg-[rgba(0,0,0,0.7)]" />
                          </div>
                          <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent
                              display={"flex"}
                              alignItems="center"
                              justifyContent={"center"}
                              w={"50vw"}
                              h={"60vh"}
                              p="5"
                            >
                              <div
                                id="profilePic"
                                className="relative w-[100%]  aspect-square bg-cover bg-no-repeat bg-center "
                                style={{
                                  backgroundImage: `url('/img/default.png')`,
                                }}
                              ></div>
                              <form className="flex items-center justify-between w-full my-3">
                                <input
                                  type="file"
                                  required
                                  name="pic"
                                  onChange={handleChange}
                                  className="custom-file-input"
                                  accept=".jpg, .jpeg, .png"
                                  max={"80"}
                                />
                                <Button onClick={onClose}>Select</Button>
                              </form>
                            </ModalContent>
                          </Modal>
                        </>
                      </Box> */}
                      <VStack alignItems={"start"} minH={"30vh"} py={7} px={5}>
                        <Text>
                          {"Agent's Name"}:{" "}
                          <span className="font-black">
                            {props.values.fullName}
                          </span>
                        </Text>
                        <br />
                        <Box>
                          <HStack>
                            <Text>Email:</Text>
                            <Field name="email">
                              {({ field, form }: any) => {
                                return (
                                  <FormControl w={""}>
                                    <Input
                                      {...field}
                                      border={""}
                                      className="border-2"
                                    />
                                  </FormControl>
                                );
                              }}
                            </Field>
                          </HStack>
                          <br />
                          <HStack>
                            <Text>Password:</Text>
                            <Field name="password">
                              {({ field, form }: any) => {
                                return (
                                  <FormControl w={""}>
                                    <Input
                                      {...field}
                                      border={""}
                                      className="border-2"
                                    />
                                  </FormControl>
                                );
                              }}
                            </Field>
                          </HStack>
                        </Box>
                      </VStack>
                    </HStack>
                    <Button ml={"auto"} type="submit">
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Box>
        </VStack>
      ) : new Date(guarantor.link.expDate) < new Date() ? (
        <div>Expired</div>
      ) : (
        <div>Completed</div>
      )}
    </VStack>
  );
};

export default Guarantor;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const uuid = params?.uuid;
  const uid = params?.uid;
  const data = await fetch(`${server}/api/applicant/getRecords`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      uid,
    }),
  });

  const userData: Candidate["documentData"] = await data.json();
  const guarantor = userData.guarantors?.filter(
    (guarantor) => guarantor.link.uuid == uuid
  )[0];
  return {
    props: { user: userData, guarantor },
  };
};
