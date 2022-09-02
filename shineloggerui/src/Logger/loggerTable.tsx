import {Wrap, WrapItem, Center, Icon} from '@chakra-ui/react'
import LoggerCard from "../components/loggerCard";
import {motion} from "framer-motion";

const LoggerTable = ({data}:any ) => {
    return (
        <>
            {data.length > 0 ?

                    <Wrap spacing='40px' className="p-2 mt-3 border border-gray-100 overflow-auto">
                        {data.map((logger: any) => (
                            <motion.div whileHover={{
                                position: 'relative',
                                zIndex: 1,
                                background: 'lightgray',
                                scale: 1.2,
                                transition: {
                                    duration: .2
                                }
                            }} key={logger.loggerName}>
                                <WrapItem key={logger.loggerName}>
                                    <LoggerCard key={logger.loggerName} title={logger.loggerName} desc={logger.description}/>
                                </WrapItem>
                            </motion.div>
                        ))}
                    </Wrap>
             : (
                <Center className="mt-5">
                    <h1>No Loggers Found</h1>
                </Center>
            )}

        </>
    )
}

export default LoggerTable;