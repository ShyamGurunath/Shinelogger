import type { NextPage } from 'next'
import {useState, useEffect} from 'react'
import Header from "../src/components/Header";
import LoggerTable from "../src/components/Logger/loggerTable";
import {Badge, Text} from '@chakra-ui/react'
import axios from "axios";

// This gets called on every request
export async function getServerSideProps() {
       var data;
        data =  await axios.get(`http://shine_api_server:8500/api/v1/logger/get-all-loggers`).then(res => res.data).then(data => data)
            .catch(err => {
                data =null;
                return { props: { data } }
            });
      // Pass data to the page via props
      return { props: { data } }
}


const Home: NextPage = ({data}:any) => {

    const [allData, setAllData] = useState(data.data  == undefined || null ? [] : data.data);
    const [filteredData, setFilteredData] = useState(data.data == undefined || null ? [] : data.data);
    const [filters, setFilters] = useState({search: '',sort:'',page:1});
    const [lastPage, setLastPage] = useState(0);
    const perPage = 8;

    useEffect(() => {
        const sortedData = allData.sort((a:any, b:any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setFilteredData(sortedData.slice(0,filters.page*perPage));
        setLastPage(Math.ceil(sortedData.length/perPage));
    },[allData]);

    useEffect(() => {
        let filtereddata = allData.filter((logger:any) => {
            return logger.loggerName.toLowerCase().startsWith(filters.search.toLowerCase());
        });



        if(filters.sort == 'asc'){
            filtereddata.sort((a:any,b:any) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });

        }
        else if(filters.sort == 'desc'){
            filtereddata.sort((a:any,b:any) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        }

        setFilteredData(filtereddata.slice(0,filters.page * perPage));
        setLastPage(Math.ceil(filtereddata.length/perPage));
    }, [filters]);




  return (
  <>
    <Header />
      <div className="flex flex-row mt-2" style={{fontFamily:"times"}}>
          <Text fontSize="30" fontWeight="bold" className="mt-2 ml-6 flex-1">Loggers</Text>
          <Badge className="mr-6 mt-5 py-2 px-6" textAlign="center" colorScheme="green">{allData.length}</Badge>
      </div>


        <div className="m-5 p-2 h-screen">

            <LoggerTable data={filteredData} setFilters={setFilters} filters={filters} lastpage={lastPage} />


        </div>
  </>
  )
}

export default Home
