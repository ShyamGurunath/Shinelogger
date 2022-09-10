import {useRef,useState} from "react";
import {Drawer,DrawerBody,DrawerContent,DrawerOverlay,DrawerCloseButton,DrawerHeader} from "@chakra-ui/modal";
import {useToast,Button,Stack,Box,FormLabel,Input,InputGroup,InputLeftAddon,Select,Textarea,DrawerFooter} from "@chakra-ui/react";
import { Checkbox } from '@chakra-ui/react'
import {EmailIcon} from "@chakra-ui/icons";
import axios from "axios";
import {router} from "next/client";
import {useRouter} from "next/router";


const AddLogger = ({onopen,setAddloggerShown}:{onopen:boolean,setAddloggerShown:any}) => {

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(onopen);
    const firstField = useRef(null);
    const [isEmailAlert, setIsEmailAlert] = useState(false);
    const [isRollingFile, setIsRollingFile] = useState(false);
    const [isFlushLogs, setIsFlushLogs] = useState(false);
    const [data, setData] = useState({
        loggerName: '',
        description: '',
        isRollingFile: false,
        rollingLogDirectorypath: '',
        isEmail: false,
        isFlushLogs: false,
        emailLogLevel:'',
        emailToPrimary:'',
        emailToSecondary:'',
        emailFrom:'',
        emailFromPassword:'',
        flushIntervalCronExpression:''
    });
    const toast = useToast();

    const closeDrawer = () => {
        setAddloggerShown(false);
        setIsOpen(onopen);
    }

    const handleEmailAlert = () => {
        setIsEmailAlert(current => !current);
    }

    const handleRollingFile = () => {
        setIsRollingFile(current => !current);

    }

    const handleFlushLogs = () => {
        setIsFlushLogs(current => !current);
    }

    const handleSubmit = async () => {

        const loggerData = {
            loggerName: data.loggerName,
            description: data.description,
            isRollingFile: isRollingFile,
            rollingLogDirectorypath: isRollingFile ? `../Logs` : '../Logs',
            isEmail: isEmailAlert,
            isFlushLogs: isFlushLogs,
            emailLogLevel:data.emailLogLevel == null ? '' : data.emailLogLevel,
            emailToPrimary:data.emailToPrimary == null ? '' : data.emailToPrimary,
            emailToSecondary:data.emailToSecondary == null ? '' : data.emailToSecondary,
            emailFrom:data.emailFrom == null ? '' : data.emailFrom,
            emailFromPassword:data.emailFromPassword == null ? '' : data.emailFromPassword,
            flushIntervalCronExpression:data.flushIntervalCronExpression == null ? '' : data.flushIntervalCronExpression
        }
        try {
            var status: any = null;
            var msg: string = "";
            const response = await axios.post(
                'http://localhost:8500/api/v1/logger/create-logger', loggerData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'API_TYPE': 'logger'
                    }
                }
            ).then(res => {
                status = res.status;
                msg = res.data.msg.toString();
            }).catch(err => console.log(err));

            if (status === 201) {

                toast({
                    title: 'Success',
                    description: msg,
                    status: 'success',
                    duration: 400,
                    isClosable: true,
                    position: 'bottom-left'
                });
                closeDrawer();
                setTimeout(() => {
                    router.reload();
                }, 200);
            }
            else {
                console.log(msg);
                toast({
                    title: "Error",
                    description: "Try Entering Valid data",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                });
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



    // @ts-ignore
    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='right'
                initialFocusRef={firstField}
                onClose={closeDrawer}
                size="sm"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>
                        Create a new Logger
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing='10px'>
                            <Box>
                                <FormLabel htmlFor='loggerName'>Logger Name</FormLabel>
                                <Input
                                    ref={firstField}
                                    id='loggerName'
                                    placeholder='Enter a LoggerName'
                                    onChange={(e) => setData({...data, loggerName: e.target.value})}
                                />
                            </Box>
                            <Box>
                                <FormLabel htmlFor='desc'>Description</FormLabel>
                                <Textarea id='desc' onChange={(e) => {
                                    setData({...data, description: e.target.value})
                                }}/>
                            </Box>

                            <Box>
                                <Checkbox onChange={handleEmailAlert}>Need Email Alerting ?</Checkbox>
                                {
                                    isEmailAlert
                                        ? (
                                            <>
                                            <InputGroup className="mt-1">
                                            <InputLeftAddon>FromEmail</InputLeftAddon>
                                            <Input type='email' placeholder='Enter Email' onChange={(e) =>{
                                                setData({...data,emailFrom:e.target.value})
                                            }}/>
                                            </InputGroup>
                                            <InputGroup className="mt-1">
                                                <InputLeftAddon>AppPassword</InputLeftAddon>

                                            <Input type='password' placeholder='Enter AppPassword' onChange={(e) => {
                                                setData({...data,emailFromPassword:e.target.value})
                                            }}/>
                                            </InputGroup>
                                                <InputGroup className="mt-1">
                                                    <InputLeftAddon>LogLevel</InputLeftAddon>
                                                    <Select placeholder='Select LogLevel' onChange={(e:any) => {
                                                        setData({...data,emailLogLevel:e.target.value})
                                                    }}>
                                                        <option value='INFO'>INFO</option>
                                                        <option value='ERROR'>ERROR</option>
                                                        <option value='DEBUG'>DEBUG</option>
                                                        <option value='CRITICAL'>CRITICAL</option>
                                                        <option value='WARNING'>WARNING</option>
                                                    </Select>
                                                </InputGroup>
                                            <InputGroup className="mt-1">
                                                <InputLeftAddon>{<EmailIcon />}</InputLeftAddon>
                                            <Input type='email' placeholder='Enter PrimaryToEmail' onChange={(e) => {
                                            }}/>
                                            </InputGroup>
                                            <InputGroup className="mt-1">
                                                <InputLeftAddon>{<EmailIcon />}</InputLeftAddon>

                                            <Input type='email' placeholder='Enter SecondaryToEmail' onChange={(e) => {
                                                setData({...data,emailToSecondary:e.target.value})
                                            }}/>
                                            </InputGroup>
                                            </>
                                        )
                                        : null
                                }

                            </Box>

                            <Box>
                                <Checkbox onChange={handleRollingFile}>Need Rolling File ?</Checkbox>
                                {
                                    isRollingFile
                                        ? (
                                            <>
                                                <InputGroup className="mt-1">
                                                    <InputLeftAddon>Dir</InputLeftAddon>
                                                    <Input type='text' placeholder='Enter Directory' value={"../Logs"} disabled onChange={(e) => {
                                                    }}/>
                                                </InputGroup>
                                                </>
                                        ):null
                                }
                            </Box>

                            <Box>
                                <Checkbox onChange={handleFlushLogs}>Flush logs on TimeInterval ?</Checkbox>
                                {
                                    isFlushLogs
                                        ? (
                                            <>
                                                <InputGroup className="mt-1">
                                                    <InputLeftAddon>TimeInterval</InputLeftAddon>
                                                    <Input type='text' placeholder='Enter a CronExpression' onChange={(e) => {
                                                        setData({...data,flushIntervalCronExpression:e.target.value})
                                                    }} />
                                                </InputGroup>
                                                </>
                                        ):null
                                }

                            </Box>

                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth='1px'>
                        <Button variant='outline' mr={3} onClick={closeDrawer}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={handleSubmit}>Create</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default AddLogger;