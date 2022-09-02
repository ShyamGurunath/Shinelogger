

import axios from "axios";
import Header from "../../src/components/Header";
import {Text,Flex,Box,VStack} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import ConfigurationPage from "../../src/components/Config";

export async function getStaticProps(context:any) {
    const data = await axios.get(`http://localhost/getlogger?loggerName=${context.params.slug}`).then(res => res.data).catch(err => console.log(err));

    return {
        props: {
            data,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 10, // In seconds
    }
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
    const data = await axios.get(`http://localhost/getloggers`)
                        .then(res => res.data)
                        .then(data => data)
                        .catch(err => console.log(err));

    // Get the paths we want to pre-render based on posts
    const paths = data.data.map((logger:any) => ({
        params: { slug: logger.loggerName },
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
}



const LoggerPage = ({ data }:{data:any}) => {

    const [isConfigPageShown, setisConfigPageShown] = useState(false);
    const [isLogsPageShown, setisLogsPageShown] = useState(true);
    const [isGraphPageShown, setisGraphPageShown] = useState(false);
    const [isRender, setisRender] = useState(false);

    const handleConfigPage = () => {
        setisLogsPageShown(current => false);
        setisGraphPageShown(current => false);
        setisConfigPageShown(current => true);
    }

    const handleLogsPage = () => {
        setisConfigPageShown(current => false);
        setisGraphPageShown(current => false);
        setisLogsPageShown(current => true);
    }

    const handleGraphPage = () => {
        setisConfigPageShown(current => false);
        setisLogsPageShown(current => false);
        setisGraphPageShown(current => true);
    }

    const connectToWebSocket = () => {
        const ws = new WebSocket(`ws://localhost/wss?clientName=${data.data.loggerName}`);
        ws.onopen = () => {
            console.log('WebSocket connected');
        }
        ws.onmessage = (event:any) => {
            console.log(event.data);
        }
        ws.onclose = () => {
            console.log('WebSocket closed');
            setInterval(() => {
                connectToWebSocket();
            }
            , 1000);
        }
        ws.onerror = (error:any) => {
            console.log(error);
            ws.close();
        }
    }

    // useEffect to connect to socket
    useEffect(() => {
        connectToWebSocket();


    },[]);

    return (
        <>
            <Header />
            <Flex color='white' className="h-screen">
                <Box flex="0.5" className=" border border-t-0 border-l-0 border-gray-200 bg-gray-800">

                    <Text fontSize="25" fontWeight="bold" className="mt-2 mb-3 ml-6 text-white">{data.data.loggerName}</Text>

                    <motion.div whileHover={{
                        position: 'relative',
                        zIndex: 1,
                        scale: 1.1,
                        transition: {
                            duration: .2
                        },
                        border: '1px solid white'
                    }} className="mx-2 pl-2 mt-3" onClick={handleLogsPage}>

                            <Text fontSize="20" fontWeight="bold" className="mt-2 ml-6 text-white">Logs</Text>

                    </motion.div>

                    <motion.div  whileHover={{
                        position: 'relative',
                        zIndex: 1,
                        scale: 1.1,
                        transition: {
                            duration: .2
                        },
                        border: '1px solid white'
                    }} className="mx-2 pl-2 mt-3" onClick={handleGraphPage}>

                        <Text fontSize="20" fontWeight="bold" className="mt-2 ml-6 text-white">Analytics</Text>

                    </motion.div>

                    <motion.div whileHover={{
                        position: 'relative',
                        zIndex: 1,
                        scale: 1.1,
                        transition: {
                            duration: .2
                        },
                        border: '1px solid white',
                    }} className="mx-2 pl-2 mt-3" onClick={handleConfigPage}>

                        <Text fontSize="20" fontWeight="bold" className="mt-2 ml-6 text-white">Configuration</Text>

                    </motion.div>

                </Box>
                <Box flex='2'>
                    {
                        isConfigPageShown ? <ConfigurationPage data={data}/>  : null
                    }
                    {
                        isLogsPageShown ? <Text className="text-black">Logs</Text> : null
                    }
                    {
                        isGraphPageShown ? <Text className="text-black">Graph</Text> : null
                    }

                </Box>
            </Flex>

        </>
    )

}

export default LoggerPage;