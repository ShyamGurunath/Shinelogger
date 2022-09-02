
import {Box, Heading, useDisclosure} from '@chakra-ui/react'
import { EditIcon,DeleteIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import axios from "axios";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button
} from '@chakra-ui/react'
import {useRef} from "react";
import { useToast } from '@chakra-ui/react'
import {useRouter} from "next/router";



const LoggerCard = ({ title,desc,...rest }:{title:string,desc:string}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const toast = useToast()
    const router = useRouter()

    const onDelete = async () => {
            const response = await axios.delete(`http://localhost/deletelogger?loggerName=${title}`).then(res => {
                console.log(res.data);
                return res.data
            }).catch(err => console.log(err));
            console.log(response);

                toast({
                    title: 'Success',
                    description: 'Logger Deleted Successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                });

                window.location.reload();

    }

    const onEdit = async () => {

    }

    const onView = async () => {
        router.push(`/logger/${title}`)
    }

  return (

      <>
      <Box p={10} shadow='md' borderWidth='2px' {...rest} onClick={onView}>
        <Heading fontSize='xl'>{title}</Heading>
          <p className="overflow-hidden truncate w-80 pt-2 pb-2">{desc}</p>
         <IconButton aria-label='EditIcon' icon={<EditIcon  color="orange" boxSize={5} />} className="mr-2 mt-2" />
          <IconButton aria-label='DeleteIcon' onClick={onOpen} icon={<DeleteIcon  color="red" boxSize={5} />}  className="mt-2" />
      </Box>
    <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
    >
        <AlertDialogOverlay />

        <AlertDialogContent>
            <AlertDialogHeader>Delete {title}</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
                Are you sure you want to delete this logger? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                    No
                </Button>
                <Button colorScheme='red' ml={3} onClick={onDelete}>
                    Yes
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
      </>
  );
}


export default LoggerCard;