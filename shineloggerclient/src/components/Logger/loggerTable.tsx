import {
    Wrap,
    WrapItem,
    Tooltip,
    HStack,
    InputGroup,
    InputLeftAddon,
    Input,
    IconButton,
    Button, Divider, Text
} from '@chakra-ui/react'
import LoggerCard from "./loggerCard";
import {motion} from "framer-motion";
import {TriangleDownIcon, TriangleUpIcon, SearchIcon, RepeatIcon} from "@chakra-ui/icons";
import AddLogger from "./AddLogger";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const LoggerTable = ({data,setFilters,filters,lastpage}:{data:any,setFilters:any,filters:any,lastpage:number} ) => {
    const router = useRouter();
    const [isAddLoggerShown, setisAddLoggerShown] = useState(false);
    const [sortButtonColor,sortSetButtonColor] = useState({
        newest:"green",
        oldest:"gray"
    });

    const handleAddLogger = () => {
        setisAddLoggerShown(true);
    }

    const search = (e:string) => {
        setFilters({
            ...filters,
            search:e,
            page:1
        });
    }

    const sortNewestToOldest = () => {
        setFilters({
            ...filters,
            sort:'desc',
            page:1
        })
        sortSetButtonColor({
            newest: "green",
            oldest: "gray"
        });
    }

    const sortOldestToNewest = () => {
        setFilters({
            ...filters,
            sort:'asc',
            page:1
        })
        sortSetButtonColor({
            newest: "gray",
            oldest: "green"
        });
    }

    const onLoadMore = () => {
        setFilters({
            ...filters,
            page:filters.page+1
        })
    }

    useEffect(() => {

    },[isAddLoggerShown])


    return (
        <>
            <div className="my-2 max-h-screen" style={{fontFamily:"times"}}>
                <HStack className="sticky top-5">
                    <InputGroup>
                        <IconButton aria-label={"reload"} icon={<RepeatIcon color="black" />} onClick={(e:any) => {
                            e.preventDefault();
                            window.location.reload()
                        }} colorScheme="black"/>
                        {/* eslint-disable-next-line react/no-children-prop */}
                        <InputLeftAddon children={<SearchIcon   />} />
                        <Input type='text' className="hover:relative " placeholder="Search for Logger" onChange={(e:any) => search(e.target.value)} maxWidth="5xl"/>
                    </InputGroup>
                    <Tooltip label="Sort Newest" background="white" color={"black"}>
                    <IconButton aria-label="FilterCreatedAT" icon={
                            <TriangleUpIcon color="black" />
                    } className="mt-2 ml-2" onClick={sortNewestToOldest} colorScheme={sortButtonColor.newest}/>
                    </Tooltip>
                    <Tooltip label="Sort Oldest" background="white" color={"black"}>
                    <IconButton aria-label="FilterCreatedATReverse" icon={<TriangleDownIcon color="black" />} className="mt-2 ml-2" onClick={sortOldestToNewest} colorScheme={sortButtonColor.oldest}/>
                    </Tooltip>
                    <Button onClick={handleAddLogger} colorScheme="green">Create</Button>
                    {isAddLoggerShown && <AddLogger onopen={isAddLoggerShown} setAddloggerShown={setisAddLoggerShown} />}
                </HStack>
                <Divider orientation="horizontal" className="mt-3"/>
            {data == null || data.length == 0 ?
                <>
                <Text className="text-3xl m-2 p-1 mt-2">No loggers</Text><br/>
                <Text className="text-2xl m-2 p-1 text-gray-800" fontSize={20}>Create a logger to start logging/ Try Refreshing !!!</Text>
                </>
                :
                <Wrap spacing='40px' className="p-2 mt-3 overflow-auto">
                    {data.map((logger: any) => (
                        <motion.div whileHover={{
                            position: 'relative',
                            zIndex: 0.8,
                            border: '1px solid gray',
                            scale: 1.04,
                            transition: {
                                duration: .2
                            }
                        }} key={logger.loggerName}>
                            <WrapItem key={logger.loggerName}>
                                <LoggerCard key={logger.loggerName} title={logger.loggerName} desc={logger.description}
                                            rest={new Date(logger.createdAt).toDateString()}/>
                            </WrapItem>
                        </motion.div>
                    ))}
                </Wrap>

            }
            { data == null || data.length == 0 ? null :
                filters.page != lastpage ? <div className="flex justify-center">
                    <Button className="p-2 mt-3 mb-3 text-white" background="purple.900" onClick={onLoadMore}>Load More</Button>
                </div>
                    : null
            }

            </div>


        </>
    )
}

export default LoggerTable;