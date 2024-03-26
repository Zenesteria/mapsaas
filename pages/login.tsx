// import HomeBtn from "@/components/HomeBtn";
import { verifyEmail, verifyPassword } from "@/services/CreateUser";
import SignInCandidate from "@/services/SignInUser";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikProps } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {useEffect, useState} from 'react'
import Nextlink from 'next/link'


const Login:NextPage = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email:'',
        password:''
    })

    const [errMsg, setErrMsg] = useState({msg:'',err:false})
    useEffect(() => {
      console.log(errMsg.msg)
    })
    
  return (
      <VStack
        flex={1}
        p={7}
        h={"100vh"}
        justifyContent='center'
      >
        <HStack>
          {/* <HomeBtn /> */}
          <Heading color={'blue.600'}>
            Agent Sign In
          </Heading>
        </HStack>

        <br />

        <Heading>Hi There! Welcome</Heading>
        <Text border={10} borderColor="blue.300">
          Please Enter Your Details
        </Text>

        <Formik
          initialValues={{
            applicationID: "",
            email: "",
            password: "",
          }}
          onSubmit={async (value, actions) => {
            try {
              await SignInCandidate(value.email, value.password, router);
            } catch (error) {
              setErrMsg({
                msg: `${error}`,
                err: true,
              });
              console.log(error);
            }
            actions.setSubmitting(false);
          }}
        >
          {(props: FormikProps<any>) => (
            <Form className="w-full">
              <VStack mx={16} my={5}>
                {errMsg.err && (
                  <p className="text-red-700">
                    Error : {errMsg.msg.split("/")[1]}
                  </p>
                )}
                {/* <Box w={'100%'} maxW={'400px'} my={4}>
                  <Field name="applicationID">
                    {({ field, form }: any) => {
                      return (
                        <FormControl
                          isInvalid={
                            form.errors.applicationID &&
                            form.touched.applicationID
                          }
                        >
                          <Input
                            border={''}
                            className=" border-2 rounded-xl"
                            {...field}
                            placeholder="Application ID"
                            isRequired
                          />
                          <FormErrorMessage>
                            {form.errors.applicationID}
                          </FormErrorMessage>
                        </FormControl>
                      );
                    }}
                  </Field>
                </Box> */}

                <Box maxW={"400px"} w="100%" my={"4!important"}>
                  <Field name="email" validate={verifyEmail}>
                    {({ field, form }: any) => {
                      return (
                        <FormControl
                          isInvalid={form.errors.email && form.touched.email}
                        >
                          <Input
                            {...field}
                            placeholder="Email Address"
                            isRequired
                            className=" border-2 rounded-xl"
                            border={""}
                          />
                          <FormErrorMessage>
                            {form.errors.email}
                          </FormErrorMessage>
                        </FormControl>
                      );
                    }}
                  </Field>
                </Box>

                <Box maxW={"400px"} w="100%" my={"4!important"}>
                  <Field name="password" validate={verifyPassword}>
                    {({ field, form }: any) => {
                      return (
                        <FormControl
                          isInvalid={
                            form.errors.password && form.touched.password
                          }
                        >
                          <Input
                            {...field}
                            placeholder="Password"
                            isRequired
                            className=" border-2 rounded-xl"
                            border={""}
                          />
                          <FormErrorMessage>
                            {form.errors.password}
                          </FormErrorMessage>
                        </FormControl>
                      );
                    }}
                  </Field>
                </Box>
                <Button
                  _hover={{}}
                  bg="blue.700"
                  color={"white"}
                  maxW='250px'
                  w={"100%"}
                  my={'10px!important'}
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Login
                </Button>
                <Link href='/'>
                    <p className=" underline my-2">Return to Map</p>
                </Link>
                {/* <HStack my={"5!important"}>
                  <p>{"Don't Have an Account? Create application"}</p>
                  <Nextlink href={"/apply"}>
                    <Link textDecoration={"underline"}>here</Link>
                  </Nextlink>
                </HStack> */}
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
  );
}

export default Login
