import {useRef,useState} from "react";
import {Drawer,DrawerBody,DrawerContent,DrawerOverlay,DrawerCloseButton,DrawerHeader} from "@chakra-ui/modal";
import {useToast,Button,Stack,Box,FormLabel,Input,InputGroup,InputLeftAddon,InputRightAddon,Select,Textarea,DrawerFooter} from "@chakra-ui/react";
import { Checkbox } from '@chakra-ui/react'
import {EmailIcon} from "@chakra-ui/icons";
import axios from "axios";
import {useRouter} from "next/router";

const AddLogger = ({onopen}:{onopen:boolean}) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(onopen);
    const firstField = useRef();
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
        setIsOpen(current => !current);
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
            rollingLogDirectorypath: data.rollingLogDirectorypath == null ? '' : data.rollingLogDirectorypath,
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
                        'API_TYPE': 'logger',
                    }
                }
            ).then(res => {
                status = res.status;
                msg = res.data.msg.toString();
                console.log(res.data);
            }).catch(err => console.log(err));

            if (status === 201) {

                toast({
                    title: 'Success',
                    description: 'Logger Created Successfully',
                    status: 'success',
                    duration: 200,
                    isClosable: true,
                    position: 'bottom-left'
                });
                // closeDrawer();
                // setTimeout(() => {
                //     router.reload();
                // }, 200);
            }
            else {
                toast({
                    title: 'Try Entering Valid Data',
                    description: msg,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                });
                //closeDrawer();
            }
        }
        catch (e) {
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
                                            <InputLeftAddon children='FromEmail' />
                                            <Input type='email' placeholder='Enter Email' onChange={(e) =>{
                                                setData({...data,emailFrom:e.target.value})
                                            }}/>
                                            </InputGroup>
                                            <InputGroup className="mt-1">
                                            <InputLeftAddon children='Password' />
                                            <Input type='password' placeholder='Enter AppPassword' onChange={(e) => {
                                                setData({...data,emailFromPassword:e.target.value})
                                            }}/>
                                            </InputGroup>
                                                <InputGroup className="mt-1">
                                                    <InputLeftAddon children="LogLevel" />
                                                    <Input type='text' placeholder='Enter LogLevel' onChange={(e) => {
                                                        setData({...data,emailLogLevel:e.target.value})
                                                    }}/>
                                                </InputGroup>
                                            <InputGroup className="mt-1">
                                            <InputLeftAddon children={<EmailIcon />} />
                                            <Input type='email' placeholder='Enter PrimaryToEmail' onChange={(e) => {
                                                setData({...data,emailToPrimary:e.target.value})
                                            }}/>
                                            </InputGroup>
                                            <InputGroup className="mt-1">
                                            <InputLeftAddon children={<EmailIcon />} />
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
                                                    <InputLeftAddon children='Dir' />
                                                    <Input type='text' placeholder='Enter Directory' onChange={(e) => {
                                                        setData({...data,rollingLogDirectorypath:e.target.value})
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
                                                    <InputLeftAddon children='TimeInterval' />
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