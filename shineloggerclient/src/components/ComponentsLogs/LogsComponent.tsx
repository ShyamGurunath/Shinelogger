import {useState} from "react";
import {
    Badge, Box,
    Button,
    Divider,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Tooltip
} from "@chakra-ui/react";
import {RepeatIcon, SearchIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import DatePicker from "react-datepicker";


const LogsComponent = ({logs,setLogFilters,LogFilters,LogLastPage}:{logs:any,setLogFilters:any,LogFilters:any,LogLastPage:number}) => {
    const [sortButtonColor,sortSetButtonColor] = useState({
        newest:"green",
        oldest:"gray"
    });

    const search = (e:string) => {
        setLogFilters({
            ...LogFilters,
            search:e,
            page:1
        });
    }

    const sortNewestToOldest = () => {
        setLogFilters({
            ...LogFilters,
            sort:'desc',
            page:1
        })
        sortSetButtonColor({
            newest: "green",
            oldest: "gray"
        });
    }

    const sortOldestToNewest = () => {
        setLogFilters({
            ...LogFilters,
            sort:'asc',
            page:1
        })
        sortSetButtonColor({
            newest: "gray",
            oldest: "green"
        });
    }

    const logLevelFilter = (e:string) => {
        setLogFilters({
            ...LogFilters,
            logLevel:e,
            page:1
        });
    }

    const logDateFilter = (dates:any) => {
        const [start, end] = dates;
        setLogFilters({
            ...LogFilters,
            startDate:start,
            endDate:end,
            page:1
        });
    };

    const onLoadMore = () => {
        setLogFilters({
            ...LogFilters,
            page:LogFilters.page+1
        })
    }


    return (
        <>
            <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css" />
            <div className="max-h-screen overflow-y-auto">

            <HStack className="sticky top-5  text-black m-5 p-3" color={"black"}>
                <IconButton aria-label={"reload"} icon={<RepeatIcon color="black" />} onClick={(e:any) => {
                    e.preventDefault();
                    window.location.reload()
                }} colorScheme="black"/>
                <InputGroup color={"black"}>
                    {/* eslint-disable-next-line react/no-children-prop */}
                    <InputLeftAddon children={<SearchIcon   />} />
                    <Input type='text'  className="text-black" placeholder="Search for LogMessage" onChange={(e:any) => search(e.target.value)} maxWidth="5xl"/>
                </InputGroup>
                <Select placeholder='Select LogLevel' onChange={(e:any) => {
                    logLevelFilter(e.target.value);
                }} color={"black"}>
                    <option value="all">All</option>
                    <option value='INFO'>INFO</option>
                    <option value='ERROR'>ERROR</option>
                    <option value='DEBUG'>DEBUG</option>
                    <option value='CRITICAL'>CRITICAL</option>
                    <option value='WARNING'>WARNING</option>
                </Select>
                <DatePicker onChange={(e) => logDateFilter(e)}
                            startDate={LogFilters.startDate}
                            endDate={LogFilters.endDate}
                            maxDate={new Date()}
                            minDate={new Date(2021, 0, 1)}
                            selectsRange={true}
                            withPortal={true}
                            dateFormat={"dd/MM/yyyy"}
                            placeholderText={"Select Date Range"}
                            className=" p-2 mx-2 text-black border">
                </DatePicker>

                <Tooltip label="Sort Newest" background="white" color={"black"}>
                    <IconButton aria-label="FilterCreatedAT" icon={
                        <TriangleUpIcon color="black" />
                    } className="mt-2 ml-2" onClick={sortNewestToOldest} colorScheme={sortButtonColor.newest}/>
                </Tooltip>
                <Tooltip label="Sort Oldest" background="white" color={"black"}>
                    <IconButton aria-label="FilterCreatedATReverse" icon={<TriangleDownIcon color="black" />} className="mt-2 ml-2" onClick={sortOldestToNewest} colorScheme={sortButtonColor.oldest}/>
                </Tooltip>

            </HStack>

                <Divider orientation="horizontal" className="my-1"/>

            <div style={{padding:"4"}}>

                <Accordion allowMultiple className="mx-3 border" mx={3} p={2} border={"lightgray"}>
                    {
                        logs && logs.map((log: any) => {
                            return (
                                <AccordionItem key={log._id} color={"black"}>
                                    <h2>
                                        <AccordionButton _expanded={{ bg: log.logLevel === 'INFO' ? 'blue.400' : log.logLevel === 'ERROR' ? 'red.300' : log.logLevel === 'DEBUG' ? 'green' : log.logLevel === 'CRITICAL' ? 'red' : log.logLevel === 'WARNING' ? 'orange' : 'gray', color: 'white' }} >
                                            <Badge className="mr-5 py-3" mr={5} py={3} width="200px" colorScheme={log.logLevel === 'INFO' ? 'blue' : log.logLevel === 'ERROR' ? 'red' : log.logLevel === 'DEBUG' ? 'green' : log.logLevel === 'CRITICAL' ? 'red' : log.logLevel === 'WARNING' ? 'orange' : 'gray'}>{log.logLevel}</Badge>
                                            <Badge  textAlign='left' className="ml-3 py-2" ml={3} py={2}>
                                                {log.logTimeStamp.toString().split('T')[0]}
                                            </Badge>

                                            <Badge  textAlign='left' className="ml-3 py-2" ml={3} py={2}>
                                                {log.logTimeStamp.toString().split('T')[1].split('.')[0]}
                                            </Badge>

                                            <Badge  textAlign='left' className="ml-3 py-2" ml={3} py={2}>
                                                Day - {(parseInt(log.logTimeStamp.toString().split('T')[0].split('-')[2]))}
                                            </Badge>

                                            <Badge  textAlign='left' className="ml-3 py-2" ml={3} py={2}>
                                                Month - {// month in words
                                                log.logTimeStamp.toString().split('T')[0].split('-')[1] === '01' ? 'January' :
                                                    log.logTimeStamp.toString().split('T')[0].split('-')[1] === '02' ? 'February' :
                                                        log.logTimeStamp.toString().split('T')[0].split('-')[1] === '03' ? 'March' :
                                                            log.logTimeStamp.toString().split('T')[0].split('-')[1] === '04' ? 'April' :
                                                                log.logTimeStamp.toString().split('T')[0].split('-')[1] === '05' ? 'May' :
                                                                    log.logTimeStamp.toString().split('T')[0].split('-')[1] === '06' ? 'June' :
                                                                        log.logTimeStamp.toString().split('T')[0].split('-')[1] === '07' ? 'July' :
                                                                            log.logTimeStamp.toString().split('T')[0].split('-')[1] === '08' ? 'August' :
                                                                                log.logTimeStamp.toString().split('T')[0].split('-')[1] === '09' ? 'September' :
                                                                                    log.logTimeStamp.toString().split('T')[0].split('-')[1] === '10' ? 'October' :
                                                                                        log.logTimeStamp.toString().split('T')[0].split('-')[1] === '11' ? 'November' :
                                                                                            log.logTimeStamp.toString().split('T')[0].split('-')[1] === '12' ? 'December' : 'Unknown'
                                            }
                                            </Badge>

                                            <Badge  textAlign='left' className="ml-3 py-2" ml={3} py={2}>
                                                Year - {log.logTimeStamp.toString().split('T')[0].split('-')[0]}
                                            </Badge>



                                            <Box flex='2' textAlign='left' className="ml-3 p-1" ml={3} p={1}>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4} className="text-black" color={"black"}>
                                        <Box className="flex my-2 mx-3">
                                            <Badge  className="ml-3 mr-2" textAlign={"center"} colorScheme="purple" my={2} mx={2} p={2}>
                                                LogMessage
                                            </Badge>
                                            <Box className="ml-3 flex-1 text-black" ml={2} my={2} p={2} color={"black"}>
                                                {log.logmessage}
                                            </Box>

                                        </Box>
                                        <Divider orientation="horizontal" my={2} />
                                        {
                                            log.additionalInfo != undefined ?
                                                <>
                                                <Badge  className="ml-3 mr-2" colorScheme="blackAlpha" mb={2}>
                                                    AdditionalInfo
                                                </Badge>

                                                    {
                                                        // from log.additionalInfo we get an object with key value pairs
                                                        // we need to iterate through the object and display the key value pairs
                                                        Object.keys(log.additionalInfo).map((key: any) => {
                                                            return (
                                                                <Box key={log._id} className="flex my-2">
                                                                    <Badge  className="ml-3 mr-2" colorScheme="pink" my={2} p={2} mx={2}>
                                                                        {key}
                                                                    </Badge>
                                                                    <Box className="ml-3 flex-1 text-black" mx={2} my={2}>
                                                                        {log.additionalInfo[key]}
                                                                    </Box>
                                                                </Box>
                                                            )
                                                        })
                                                    }
                                                </>:
                                                null

                                        }



                                    </AccordionPanel>
                                </AccordionItem>
                            )
                        })
                    }
                </Accordion>
                { logs == null || logs.length == 0 ? null :
                    LogFilters.page != LogLastPage ? <div className="flex justify-center">
                            <Button className="p-2 m-2" m={2} p={2} background="purple.900" onClick={onLoadMore}>Load More</Button>
                        </div>
                        : null
                }

            </div>

            </div>
        </>
    )

}

export default LogsComponent;