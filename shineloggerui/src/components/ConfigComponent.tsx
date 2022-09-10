import {Text} from "@chakra-ui/react"

const ConfigurationPage = ({data}:{data:any}) => {

    return (
        <>
            <Text className="text-black">{data.data.loggerName}</Text>
            <Text className="text-black">{data.data.description}</Text>
        </>
        )

}

export default ConfigurationPage;