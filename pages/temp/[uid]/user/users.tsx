import Authenticate from "@/components/Authenticate";
import GuarantorCard from "@/components/Card";
import { auth } from "@/config/firebase/firebaseConfig";
import addGuarantor from "@/services/AddUser";
import { verifyEmail } from "@/services/CreateUser";
import { Candidate } from "@/types/Schemas/Candidate";
import { server } from "@/util/Server";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { Field, Form, Formik, FormikProps } from "formik";
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface pageProps {
  user: Candidate["documentData"];
}

const Guarantors: NextPage<pageProps> = ({ user }: pageProps) => {
  const router = useRouter();
  const [add, setAdd] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Authenticate>
      <Link href={`/PollingForm`}>
        <p className="p-4">Polling Form</p>
      </Link>
      <VStack alignItems={"start"} p={10}>
        <HStack display={"flex"} flexWrap={"wrap"}>
          {/* <GuarantorCard/> */}
          {user.guarantors?.map((guarantor, index) => {
            return (
              <GuarantorCard
                link={`${server}/temp/${auth.currentUser?.uid}/user/${guarantor.link.uuid}`}
                expired={
                  new Date(guarantor.link.expDate) > new Date() &&
                  guarantor.emailAddress.data.length != 0
                }
                completed={guarantor.emailAddress.data.length != 0}
                key={`${index}guarantor`}
              />
            );
          })}
          <Button
            onClick={user.guarantors?.length != 2 ? onOpen : () => {}}
            p={10}
            flex={1}
            minW={"300px"}
            m={"4!important"}
            height="30vh"
            cursor={user.guarantors?.length != 2 ? "pointer" : "default"}
            _hover={user.guarantors?.length ? {} : { bg: "gray.200" }}
            _active={user.guarantors?.length ? {} : { bg: "gray.300" }}
          >
            {user.guarantors?.length != 2 ? (
              <HStack>
                <FaPlus className="text-[2rem] mx-3" />
                <p>New User</p>
              </HStack>
            ) : (
              <HStack color={"gray.400"}>
                <p>Max. Guarantors Reached</p>
              </HStack>
            )}
          </Button>
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Guarantor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-center">
              <Text fontWeight={"bold"} mb={3}>
                Send A request email to your guarantor
              </Text>
              <Text>
                Note that your guarantor will have to fill the form sent to
                him/her to be recognized and verified as a guarantor
              </Text>
              <Formik
                initialValues={{
                  email: "",
                }}
                onSubmit={async (value, action) => {
                  console.log("from user", auth.currentUser?.uid);
                  await addGuarantor(
                    value.email,
                    `${auth.currentUser?.uid}`,
                    user.guarantors || []
                  );
                  action.setSubmitting(false);
                  router.push(`/temp/${auth.currentUser?.uid}/users`);
                  onClose();
                  // console.log(value)
                }}
              >
                {(props: FormikProps<any>) => (
                  <Form className="flex flex-col w-[400px]">
                    <Box my={5}>
                      <Field name="email" validate={verifyEmail}>
                        {({ field, form }: any) => (
                          <FormControl className="w-full">
                            <Input
                              {...field}
                              placeholder="Email"
                              isInvalid={
                                form.errors.email && form.touched.email
                              }
                              isRequired
                            />
                            <FormErrorMessage>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Button type="submit" isLoading={props.isSubmitting}>
                      Send Request
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button bg={"red.600"} color="white" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Authenticate>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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

  const user: Candidate["documentData"] = await data.json();

  return {
    props: { user },
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const users: User[] = await (
//     await fetch(`${server()}/api/applicant/getApplicants`)
//   ).json();
//   return {
//     paths: users.map((user) => ({ params: { uid: user.uid } })),
//     fallback: false,
//   };
// };

export default Guarantors;
