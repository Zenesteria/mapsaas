import { Box, Button, HStack, Text, useToast } from '@chakra-ui/react'
import React from 'react'
import { FaCopy } from 'react-icons/fa'

interface compProps{
  expired:boolean
  link:string
  completed:boolean
}

export default function GuarantorCard({link, expired,completed}:compProps) {
  const toast = useToast();
  const handleClick =async () => {
      try {
        await navigator.clipboard.writeText(link)
        toast({
          title: "Link Copied to clipboard",
          description: ``,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "An Error Occurred",
          description: ``,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        
      }
  }
  return (
    <div className="border-2 p-3 shadow-lg min-w-[300px] flex-1 max-w-[450px] h-[30vh] my-3 mr-3">
      <HStack>
        <Text fontWeight={"bold"}>Status</Text>
        <Text
          fontWeight={"semibold"}
          color={!expired ? "yellow.500" : "red.400"}
        >
          {!expired ? "Awaiting Response. . ." : "Link Expired"}
        </Text>
      </HStack>

      <Box
        p={5}
        bg="gray.100"
        my={4}
        transitionDuration=".3s"
        color="gray.500"
        cursor={"pointer"}
        _hover={{ bg: "gray.200" }}
        className='group'
        pos={'relative'}
        onClick={handleClick}
      > 
        <FaCopy className='absolute top-3 right-2 invisible group-hover:visible'/>
        <Text>{link}</Text>
      </Box>
    </div>
  );
}
