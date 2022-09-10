
import {Badge, Box, Heading, useDisclosure,Text} from '@chakra-ui/react'
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
import {useEffect, useRef, useState} from "react";
import { useToast } from '@chakra-ui/react'
import {useRouter} from "next/router";
import UpdateLogger from './UpdateLogger';



const LoggerCard = ({ title,desc,rest}:{title:string,desc:string,rest:any}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isUpdateLoggerShown, setisUpdateLoggerShown] = useState(false);
    const cancelRef = useRef(null)
    const toast = useToast()
    const router = useRouter()

    const onDelete = async () => {
        try {
            var msg : string = "";
            var status : any = null;
            const response = await axios.delete(`http://localhost:8500/api/v1/logger/delete-logger/${title}`).then(res => {
                return {
                    data: res.data.msg.toString(),
                    status: res.status
                };
            }).then(data => {
                msg = data.data;
                status = data.status;
            }).catch(err => {
                console.log(err);
            });

            console.log(response);


            if (status === 200) {
                toast({
                    title: 'Success',
                    description: msg,
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'bottom-left'
                });
                onClose();
                setTimeout(() => {
                    router.reload();
                }, 1000);
            } else {
                toast({
                    title: 'Error',
                    description: msg,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                });
                onClose();
            }
        }
        catch (e:any) {
            toast({
                title: 'Error',
                description: e.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            }
            );
        }

    }

    useEffect(() => {

    },[isUpdateLoggerShown]);

    const onEdit = async () => {
        setisUpdateLoggerShown(true);
    }

    const onView = async () => {
        router.push(`/logger/${title}`)
    }

  // @ts-ignore
    // @ts-ignore
    return (

      <>
      <Box className={""} p={8}  shadow='md' borderWidth='2px' width={'300px'} minH={250} maxH={250}>
        <Heading fontSize='xl' onClick={onView} className="cursor-pointer">{title}</Heading>
          <Text className={"truncate overflow-hidden w-30 py-2"} fontSize={20}>
              {
                  desc.length > 50 ? desc.substring(0,50) + "..." : desc
              }
          </Text>
          <Badge className="mt-2 pt-2 pb-2 lg:text-blue border ">{rest}</Badge>
          <br/>

         <IconButton aria-label='EditIcon' onClick={onEdit} icon={<EditIcon  color="orange" boxSize={5} />} className="mb-2 p-2 mt-3" />
          <IconButton aria-label='DeleteIcon' onClick={onOpen} icon={<DeleteIcon  color="red" boxSize={5} />}  className="ml-2 p-2 mb-2 mt-3" />
      </Box>
    <AlertDialog
        motionPreset='slideInRight'
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
          {
                isUpdateLoggerShown ? <UpdateLogger title={title} onopen={isUpdateLoggerShown} setUpdateloggerShown={setisUpdateLoggerShown} /> : null
          }
      </>
  );
}


export default LoggerCard;