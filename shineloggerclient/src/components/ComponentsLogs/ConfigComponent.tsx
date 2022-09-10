import {
    Box, Button,
    Checkbox,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Stack,
    Textarea, useToast
} from "@chakra-ui/react"
import {useEffect, useState} from "react";
import {EmailIcon} from "@chakra-ui/icons";
import axios from "axios";
import {useRouter} from "next/router";



const ConfigurationPage = ({data}:{data:any}) => {
    const router = useRouter();
    const toast = useToast();
    const [isEmailAlert, setIsEmailAlert] = useState(data.data.isEmail);
    const [isRollingFile, setIsRollingFile] = useState(data.data.isRollingFile);
    const [isFlushLogs, setIsFlushLogs] = useState(data.data.isFlushLogs);
    const [Data, setData] = useState(data.data);
    const [password, setPassword] = useState(data.data.emailFromPassword === null || undefined ? "" : data.data.emailFromPassword);


    const handleEmailAlert = () => {
        setIsEmailAlert((current:boolean) => !current);
        setData({...Data, isEmail: !Data.isEmail});
    }

    const handleRollingFile = () => {
        setIsRollingFile((current:boolean) => !current);
        setData({...Data, isRollingFile: !Data.isRollingFile});

    }


    const handleFlushLogs = () => {
        setIsFlushLogs((current:boolean) => !current);
        setData({...Data, isFlushLogs: !Data.isFlushLogs});
    }

    const handleSubmit = async () => {

        const loggerData = {
            loggerName: Data.loggerName,
            description: Data.description,
            isRollingFile: Data.isRollingFile,
            rollingLogDirectorypath: Data.isRollingFile ? "../Logs" : `../Logs`,
            isEmail: Data.isEmail,
            isFlushLogs: Data.isFlushLogs,
            emailLogLevel:Data.emailLogLevel == null ? '' : Data.emailLogLevel,
            emailToPrimary:Data.emailToPrimary == null ? '' : Data.emailToPrimary,
            emailToSecondary:Data.emailToSecondary == null ? '' : Data.emailToSecondary,
            emailFrom: Data.emailFrom == null ? '' : Data.emailFrom,
            emailFromPassword: password === Data.emailFromPassword ? base64Decode(Data.emailFromPassword) : Data.emailFromPassword,
            flushIntervalCronExpression:Data.flushIntervalCronExpression == null ? '' : Data.flushIntervalCronExpression
        }
        console.log(loggerData);
        try {
            var status: any = null;
            var msg: string = "";
            const response = await axios.put(
                `http://localhost:8500/api/v1/logger/update-logger/${Data.loggerName}`, loggerData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'API_TYPE': 'logger',
                    }
                }
            ).then(res => {
                status = res.status;
                msg = res.data.msg.toString();
                console.log(res);
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
                setTimeout(() => {
                    router.reload();
                }, 500);
            }
            else {
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

    useEffect(() => {
        console.log("effect");
    }, [Data])

    const base64Decode = (str:string) => {
        return Buffer.from(str, 'base64').toString('ascii');
    }

    return (
        <>
            <Stack spacing='10px' className="p-5 m-5 text-black" color="black">
                <Box>
                    <FormLabel htmlFor='loggerName' className="text-black text-6xl">Logger Name</FormLabel>
                    <Input
                        id='loggerName'
                        value={Data.loggerName}
                        disabled
                        className="text-black text-6xl"
                    />
                </Box>
                <Box>
                    <FormLabel htmlFor='desc' className="text-black text-6xl">Description</FormLabel>
                    <Textarea id='desc' onChange={(e) => {
                        setData({...Data, description: e.target.value})

                    }} value={Data.description} className="text-black text-6xl"/>
                </Box>

                <Box>
                    <Checkbox onChange={handleEmailAlert} isChecked={isEmailAlert} className="text-black text-6xl" >Need Email Alerting ?</Checkbox>
                    {
                        isEmailAlert
                            ? (
                                <>
                                    <InputGroup className="mt-1">
                                        <InputLeftAddon className="text-black text-6xl" >FromEmail</InputLeftAddon>
                                        <Input type='email' placeholder='Enter Email' onChange={(e) =>{
                                            setData({...Data,emailFrom:e.target.value})
                                        }} className="text-black text-6xl" value={Data.emailFrom} />
                                    </InputGroup>
                                    <InputGroup className="mt-1">
                                        <InputLeftAddon className="text-black text-6xl" >AppPassword</InputLeftAddon>
                                        <Input type='password' placeholder='Enter AppPassword' value={Data.emailFromPassword} onChange={(e) => {
                                            setData({...Data,emailFromPassword:e.target.value})
                                        }} className="text-black text-6xl" />
                                    </InputGroup>
                                    <InputGroup className="mt-1">
                                        <InputLeftAddon className="text-black text-6xl" >LogLevel</InputLeftAddon>
                                        <Select placeholder='Select LogLevel' value={Data.emailLogLevel} onChange={(e:any) => {
                                            setData({...Data,emailLogLevel:e.target.value})
                                        }} className="text-black text-6xl" >
                                            <option value='INFO'>INFO</option>
                                            <option value='ERROR'>ERROR</option>
                                            <option value='DEBUG'>DEBUG</option>
                                            <option value='CRITICAL'>CRITICAL</option>
                                            <option value='WARNING'>WARNING</option>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup className="mt-1">
                                        <InputLeftAddon className="text-black text-6xl" >{<EmailIcon />}</InputLeftAddon>
                                        <Input type='email' placeholder='Enter PrimaryToEmail' value={Data.emailToPrimary} onChange={(e) => {
                                            setData({...Data,emailToPrimary:e.target.value})
                                        }} className="text-black text-6xl" />
                                    </InputGroup>
                                    <InputGroup className="mt-1">
                                        <InputLeftAddon className="text-black text-6xl" >{<EmailIcon />}</InputLeftAddon>
                                        <Input type='email' placeholder='Enter SecondaryToEmail' value={Data.emailToSecondary} onChange={(e) => {
                                            setData({...Data,emailToSecondary:e.target.value})
                                        }} className="text-black text-6xl"/>
                                    </InputGroup>
                                </>
                            )
                            : null
                    }

                </Box>

                <Box>
                    <Checkbox onChange={handleRollingFile} isChecked={isRollingFile} className="text-black text-6xl">Need Rolling File ?</Checkbox>
                    {
                        isRollingFile
                            ? (
                                <>
                                    <InputGroup className="mt-1">
                                        <InputLeftAddon className="text-black text-6xl">Dir</InputLeftAddon>
                                        <Input type='text' placeholder='Enter Directory' disabled value={"../Logs"} onChange={(e) => {

                                        }} className="text-black text-6xl"/>
                                    </InputGroup>
                                </>
                            ):null
                    }
                </Box>

                <Box>
                    <Checkbox onChange={handleFlushLogs} isChecked={isFlushLogs} className="text-black text-6xl">Flush logs on TimeInterval ?</Checkbox>
                    {
                        isFlushLogs
                            ? (
                                <>
                                    <InputGroup className="mt-1">
                                        <InputLeftAddon className="text-black text-6xl" >TimeInterval</InputLeftAddon>
                                        <Input type='text' placeholder='Enter a CronExpression' value={Data.flushIntervalCronExpression} onChange={(e) => {
                                            setData({...Data,flushIntervalCronExpression:e.target.value})
                                        }} className="text-black text-6xl" />
                                    </InputGroup>
                                </>
                            ):null
                    }

                </Box>


                    <Button colorScheme='blue' width={20} onClick={handleSubmit}>Update</Button>


            </Stack>
        </>
        )

}

export default ConfigurationPage;