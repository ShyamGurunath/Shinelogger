import axios from "axios";
import Header from "../../src/components/Header";
import {Text, Flex, Box, Badge, IconButton, useToast} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {useEffect, useState, useRef, ReactNode} from "react";
import ConfigurationPage from "../../src/components/ComponentsLogs/ConfigComponent";
import {ArrowBackIcon} from "@chakra-ui/icons";
import LogsComponent from "../../src/components/ComponentsLogs/LogsComponent";
import Analytics from "../../src/components/ComponentsLogs/GraphComponent";

export async function getServerSideProps(context:any) {
    const data = await axios.get(`http://shine_api_server:8500/api/v1/logger/get-logger/${context.params.slug}`).then(res => res.data).catch(err => console.log(err));
    return {
        props: {
            data,
        }
    }
}



const LoggerPage = ({ data }:{data:any}) => {

    const toast = useToast();
    const [isConfigPageShown, setisConfigPageShown] = useState(false);
    const [isLogsPageShown, setisLogsPageShown] = useState(true);
    const [isGraphPageShown, setisGraphPageShown] = useState(false);
    const effectRan = useRef(false);
    const [isActive, setisActive] = useState(false);
    const [isActiveTab, setisActiveTab] = useState('logs');
    const [isBusy, setBusy] = useState(true);
    const [logsData, setLogsData] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [filteredLogsData, setFilteredLogsData] = useState([]);
    const [filteredGraphData, setFilteredGraphData] = useState([]);
    const [Logfilters, setLogFilters] = useState({search: '',sort:'',page:1,logLevel:'',startDate: null,endDate: null});
    const [Graphfilters, setGraphFilters] = useState({logLevel:'',startDate: new Date(),endDate: null});
    const [LoglastPage, setLogLastPage] = useState(0);
    const perPage = 10;


    const fetchLogs = async () => {
        const response = await fetch(`http://localhost:8500/api/v1/log/get-logs/${data.data.loggerName}`);
        console.log("fetching logs");

        const logs = await response.json();

        const sortedlogs = logs.data.sort((a:any,b:any) => {
            return new Date(b.logTimeStamp).getTime() - new Date(a.logTimeStamp).getTime();
        });
        await setLogsData(sortedlogs);

        await setGraphData(sortedlogs);

        await setFilteredLogsData(sortedlogs.slice(0,Logfilters.page*perPage));

        await setFilteredGraphData(sortedlogs);

        await setLogLastPage(Math.ceil(sortedlogs.length/perPage));

        return logs;
    }


    // useEffect to connect to socket
    useEffect(() => {

        console.log("effect ran");

        if(!effectRan.current) {

            (async () => {
                const logs = await fetchLogs();
                setBusy(false);

                logs.data === undefined || logs.data.length === 0 || [] ?
                    setGraphFilters({...Graphfilters,
                        startDate: new Date(),
                        endDate: null})
                    :
                    setGraphFilters({...Graphfilters,
                        startDate: new Date(logs.data[logs.data.length-1].logTimeStamp)
                        ,endDate: null});

            })();
            connectToWebSocket();

        }


        return () => {
            effectRan.current = true;
        }

    },[]);



    useEffect(() => {

        // console.log(Logfilters);

        let filtereddata = logsData.filter((log:any) => {
            return log.logmessage.toLowerCase().includes(Logfilters.search.toLowerCase())
        });

        // filter by log level
        if (Logfilters.logLevel !== '' && Logfilters.logLevel !== 'all') {
            filtereddata = filtereddata.filter((log:any) => {
                return log.logLevel.toLowerCase().startsWith(Logfilters.logLevel.toLowerCase());
            });
        }
        if (Logfilters.logLevel === 'all') {
            filtereddata = logsData;
        }

        // filter by date
        if (Logfilters.startDate  && Logfilters.endDate) {
            filtereddata = filtereddata.filter((log:any) => {
                return new Date(log.logTimeStamp).getTime() >= new Date(Logfilters.startDate!).getTime() && new Date(log.logTimeStamp).getTime() <= new Date(Logfilters.endDate!).getTime();
            });
        }

        if(Logfilters.sort == 'asc'){
            filtereddata.sort((a:any,b:any) => {
                return new Date(a.logTimeStamp).getTime() - new Date(b.logTimeStamp).getTime();
            });
        }
        if(Logfilters.sort == 'desc'){
            filtereddata.sort((a:any,b:any) => {
                return new Date(b.logTimeStamp).getTime() - new Date(a.logTimeStamp).getTime();
            });
        }

         setFilteredLogsData(filtereddata.slice(0,Logfilters.page*perPage));
        setLogLastPage(Math.ceil(filtereddata.length/perPage));
    }, [Logfilters]);

    useEffect(() => {

        //console.log(Graphfilters);

        let filtereddata = graphData;

        // filter by log level
        if (Graphfilters.logLevel !== '' && Graphfilters.logLevel !== 'all') {
            filtereddata = filtereddata.filter((log:any) => {
                return log.logLevel.toLowerCase().startsWith(Graphfilters.logLevel.toLowerCase());
            });
        }
        if (Graphfilters.logLevel === 'all') {
            filtereddata = graphData;
        }


        // filter by date
        if (Graphfilters.startDate  && Graphfilters.endDate !=null ) {
            filtereddata === undefined || null || [] ?
            filtereddata = graphData.filter((log:any) => {
                return new Date(log.logTimeStamp).getTime() >= new Date(Graphfilters.startDate).getTime() && new Date(log.logTimeStamp).getTime() <= new Date(Graphfilters.endDate!).getTime();
            }) :
            filtereddata = filtereddata.filter((log:any) => {
                return new Date(log.logTimeStamp).getTime() >= new Date(Graphfilters.startDate).getTime() && new Date(log.logTimeStamp).getTime() <= new Date(Graphfilters.endDate!).getTime();
            });
        }

        setFilteredGraphData(filtereddata);

    }, [Graphfilters]);



    const handleConfigPage = () => {
        setisLogsPageShown(current => false);
        setisGraphPageShown(current => false);
        setisConfigPageShown(current => true);
        setisActiveTab(current => 'config');
    }

    const handleLogsPage = () => {
        setisConfigPageShown(current => false);
        setisGraphPageShown(current => false);
        setisLogsPageShown(current => true);
        setisActiveTab(current => 'logs');
    }

    const handleGraphPage = () => {
        setisConfigPageShown(current => false);
        setisLogsPageShown(current => false);
        setisGraphPageShown(current => true);
        setisActiveTab(current => 'graph');
    }

    const connectToWebSocket = () => {
        const ws = new WebSocket(`ws://localhost/wss?clientName=${data.data.loggerName}`);
        ws.onopen = () => {
            console.log('WebSocket connected');
            toast({
                title: "Client Connected",
                description: "Client Connected",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            })
            setisActive(true);
        }
        ws.onmessage = async (event:any) => {
            await fetchLogs();
            toast({
                title: "New Log",
                description: "New log has been added",
                status: "success",
                duration: 1000,
                isClosable: true,
                position:"bottom-left"
            })
        }
        ws.onclose = () => {
            console.log('WebSocket disconnected');
            toast({
                title: "Client Disconnected, Retrying!!" ,
                description: "Client Disconnected, Retrying!!",
                status: "error",
                duration: 1000,
                isClosable: true,
                position:"top-right"
            });
            setTimeout(() => {
                connectToWebSocket();
            }, 2000);
            setisActive(false);
        }
        ws.onerror = (error:any) => {
            console.log(error);
            ws.close();
        }
    }

    return (
        <>
            <Header />

                <Flex color='white' className="h-screen flex-row sticky flex-grow top-0">
                    <Box flex="0.5"
                         className=" border border-t-0 border-l-0 h-full max-h-screen overflow-y-auto border-gray-200 bg-gray-800 sticky top-0">
                        <Flex className="p-.3 border-b border-gray-200">
                            <IconButton aria-label="backtohome" icon={<ArrowBackIcon color="black"/>}
                                        className="mt-2 ml-2 bg-gray-300" onClick={() => {
                                window.history.back();
                            }}/>
                            <Text fontSize="25" fontWeight="bold"
                                  className="mt-2 mb-3 ml-6 text-white">{data.data.loggerName}</Text>
                        </Flex>

                        {
                            isActive ? <Badge colorScheme='green' className="mt-4 mb-4 ml-10 p-1">Active</Badge> :
                                <Badge colorScheme='red' className="mt-4 mb-4 ml-10 p-1">Offline</Badge>

                        }
                        {
                            isActiveTab == 'logs' ?
                                <Text fontSize="20" fontWeight="bold" className="mt-2 ml-6"
                                      color="green.400">Logs</Text> :
                                <motion.div whileHover={{
                                    position: 'relative',
                                    zIndex: 1,
                                    scale: 1.1,
                                    transition: {
                                        duration: .2
                                    },
                                    border: '1px solid white'
                                }} className="mx-2 pl-2 mt-3 cursor-pointer"
                                            onClick={handleLogsPage}>

                                    <Text fontSize="20" fontWeight="bold" className="mt-2 ml-6 text-white">Logs</Text>

                                </motion.div>
                        }

                        {
                            isActiveTab == 'graph' ?
                                <Text fontSize="20" fontWeight="bold" className="mt-2 ml-6"
                                      color="green.400">Analytics</Text> :
                                <motion.div whileHover={{
                                    position: 'relative',
                                    zIndex: 1,
                                    scale: 1.1,
                                    transition: {
                                        duration: .2
                                    },
                                    border: '1px solid white'
                                }} className="mx-2 pl-2 mt-3 cursor-pointer" onClick={handleGraphPage}>

                                    <Text fontSize="20" fontWeight="bold"
                                          className="mt-2 ml-6 text-white">Analytics</Text>

                                </motion.div>
                        }

                        {
                            isActiveTab == 'config' ?
                                <Text fontSize="20" fontWeight="bold" className="mt-2 ml-6"
                                      color="green.400">Configuration</Text> :
                                <motion.div whileHover={{
                                    position: 'relative',
                                    zIndex: 1,
                                    scale: 1.1,
                                    transition: {
                                        duration: .2
                                    },
                                    border: '1px solid white',
                                }} className="mx-2 pl-2 mt-3 cursor-pointer" onClick={handleConfigPage}>

                                    <Text fontSize="20" fontWeight="bold"
                                          className="mt-2 ml-6 text-white">Configuration</Text>

                                </motion.div>
                        }


                    </Box>

                    <Box flex='2'>
                        {
                            isConfigPageShown ? <ConfigurationPage data={data}/> : null
                        }
                        {

                            isLogsPageShown && isBusy == false ?
                                <LogsComponent logs={filteredLogsData} setLogFilters={setLogFilters}
                                               LogFilters={Logfilters} LogLastPage={LoglastPage}/>
                                : null
                        }
                        {
                            isGraphPageShown && isBusy == false ?
                                <Analytics data={filteredGraphData} setGraphFilters={setGraphFilters}
                                           graphfFilters={Graphfilters}/> : null
                        }

                    </Box>
                </Flex>

        </>
    )

}

export default LoggerPage;