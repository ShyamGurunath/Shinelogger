import type { NextPage } from 'next'
import { useState,useCallback } from 'react'
import Header from "../src/components/Header";
import LoggerTable from "../src/Logger/loggerTable";
import {HStack, Input, InputGroup, InputLeftAddon, Divider, Button, Text} from '@chakra-ui/react'
import AddLogger from "../src/Logger/AddLogger";
import axios from "axios";
import {SearchIcon} from "@chakra-ui/icons";

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
    var data;
    try {
        data =  await axios.get(`http://localhost/getloggers`).then(res => res.data).then(data => data).catch(err => console.log(err));
    }
      catch (err) {
        console.error(err)
          const data = null;
        return { props: { data } }
      }
  // Pass data to the page via props
  return { props: { data } }
}


const Home: NextPage = ({data}:any) => {
    //Add Logger
    const [isLoggerShown, setisLoggerShown] = useState(false);
  // search state
    const [search, setSearch] = useState('');

    const [filteredData, setFilteredData] = useState(data.data);
    const handleSearch = useCallback(e => {
        setSearch(e.target.value);
        const filtereddata = data.data.filter((logger:any) => {
            return logger.loggerName.toLowerCase().includes(e.target.value.toLowerCase());
        }
        );
        setFilteredData(filtereddata);
    }
    , [filteredData])

    const handleAddLogger = () => {
        setisLoggerShown(current => !current);
    }


  return (
  <>
    <Header />
      <Text fontSize="30" fontWeight="bold" className="mt-2 ml-6">Loggers</Text>

      { data == null ? <Text>Loading...</Text> :
    <div className="m-5 p-2">
        <HStack>
        <InputGroup className="lg:">
            {/* eslint-disable-next-line react/no-children-prop */}
            <InputLeftAddon children={<SearchIcon   />} />
            <Input type='text' placeholder="Search for Logger" onChange={handleSearch} value={search} maxWidth="5xl"/>
        </InputGroup>
        <Button onClick={handleAddLogger}>Add Logger</Button>
            {isLoggerShown && <AddLogger onopen={isLoggerShown} />}
        </HStack>
        <Divider orientation="horizontal" className="mt-3"/>
        {
            filteredData.length > 0 ? <LoggerTable data={filteredData} /> : <Text fontSize="20" fontWeight="bold" className="mt-2 ml-6">No Loggers Found</Text>
        }
    </div> }
  </>
  )
}

export default Home
