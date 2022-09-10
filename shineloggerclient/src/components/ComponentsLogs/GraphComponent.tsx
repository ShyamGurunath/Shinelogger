import KpiCard from "./Charts/KpiCard";
import PieChart from "./Charts/PieChart";
import BarChart from "./Charts/BarChart";
import LineChart from "./Charts/LineChart";
import {Box, Flex, HStack, Select} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {Chart} from "react-google-charts";

const Analytics = ({data,setGraphFilters,graphfFilters}:{data:any,setGraphFilters:any,graphfFilters:any}) => {

    const labels = ['Errors', 'Warnings', 'Info', 'Debug','Critical'];
    const colors = ['rgba(229,71,108,0.2)',
        'rgba(161,124,33,0.59)',
        'rgba(49,142,183,0.2)',
        'rgba(36,145,44,0.2)',
        'rgba(110,5,32,0.2)'];
    const borderColors = ['rgba(229,71,108,1)',
        'rgba(197,146,37,1)',
        'rgba(49,142,183,1)',
        'rgba(36,145,44,1)',
        'rgba(110,5,32,1)'];
    const firstlog = data[0] === undefined || null ? null : data[0];


    const barchartData = [
        ['Logger', 'Errors', 'Warnings', 'Info', 'Debug','Critical'],
        ['Logs', data.filter((log:any) => log.logLevel === 'ERROR').length,
            data.filter((log:any) => log.logLevel === 'WARNING').length,
            data.filter((log:any) => log.logLevel === 'INFO').length,
            data.filter((log:any) => log.logLevel === 'DEBUG').length,
            data.filter((log:any) => log.logLevel === 'CRITICAL').length],
    ]

   const pieChartData = [
        ['Logger', 'No of Logs'],
        ['Errors', data.filter((log:any) => log.logLevel === 'ERROR').length],
        ['Warnings', data.filter((log:any) => log.logLevel === 'WARNING').length],
        ['Info', data.filter((log:any) => log.logLevel === 'INFO').length],
        ['Debug', data.filter((log:any) => log.logLevel === 'DEBUG').length],
        ['Critical', data.filter((log:any) => log.logLevel === 'CRITICAL').length]
   ]

    const pieChartOptions = {
        title: 'Total Logs',
        pieHole: 0.4,
        legend: {position: 'bottom', alignment: 'center'},
        chartArea: {left: 0, top: 0, width: '100%', height: '80%'},
        tooltip: {showColorCode: true},
        is3D: false,
        colors: [
            "red",
            "orange",
            "blue",
            "green",
            "purple"
        ],
        animation: {
            startup: true,
            easing: 'linear',
            duration: 1500,
        }
    };

    const barChartOptions = {
        // Material design options
        chart: {
            title: 'Total Logs',
            subtitle: 'Logs by level',
        },
        legend: {position: 'bottom', alignment: 'center'},
        chartArea: {left: 0, top: 0, width: '100%', height: '80%'},
        tooltip: {showColorCode: true},
        is3D: false,
        colors: [
            "red",
            "orange",
            "blue",
            "green",
            "purple"
        ],
        animation: {
            startup: true,
            easing: 'linear',
            duration: 1500,
        },
    };


    const calendarData = [
        [
            { type: 'date', id: 'Date' },
            { type: 'number', id: 'TotalLogs' },
        ],
        // get the date and the number of logs for that date and push it to the array
        ...data.map((log:any) => [new Date(log.logTimeStamp), data.filter((log:any) => log.logTimeStamp === log.logTimeStamp).length])
      ]

        const calendarOptions = {
            title: 'Total Logs',
            legend: {position: 'bottom', alignment: 'center'},
            chartArea: {left: 0, top: 0, width: '100%', height: '80%'},
            tooltip: {showColorCode: true},
            is3D: false,
            colors: [
                "red",
                "orange",
                "blue",
                "green",
                "purple"
            ],
            animation: {
                startup: true,
                easing: 'linear',
                duration: 1500,
            }
        }



    const logLevelFilter = (e:string) => {
        setGraphFilters({
            ...graphfFilters,
            logLevel:e
        });
    }

    const logDateFilter = (dates:any) => {
        const [start, end] = dates;
        setGraphFilters({
            ...graphfFilters,
            startDate:start,
            endDate:end
        });
    };



    return (
        <>
            <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css" />
            <div className="max-h-screen h-screen">

            <div className="mx-3 my-2" style={{margin:"3px"}}>
                <HStack className="text-black mx-5 p-3" mx={5} p={3} color={"black"}>

                    <Select placeholder='Select LogLevel' onChange={(e:any) => {
                        logLevelFilter(e.target.value);
                    }}>
                        <option value="all">All</option>
                        <option value='INFO'>INFO</option>
                        <option value='ERROR'>ERROR</option>
                        <option value='DEBUG'>DEBUG</option>
                        <option value='CRITICAL'>CRITICAL</option>
                        <option value='WARNING'>WARNING</option>
                    </Select>
                    <DatePicker onChange={(e) => logDateFilter(e)}
                                startDate={graphfFilters.startDate}
                                endDate={graphfFilters.endDate}
                                maxDate={new Date()}
                                minDate={new Date('2021-01-01')}
                                selectsRange={true}
                                dateFormat={"dd/MM/yyyy"}
                                withPortal
                                className=" p-2 mx-2 text-black border">
                    </DatePicker>

                </HStack>
            </div>

  <Box className="chart-container  mx-5 my-3" mx={5} my={3}>
        <Box className="flex flex-col w-full" color={"black"}>
            <Flex className="flex flex-row justify-evenly items-center mt-3 mx-5" mx={5} mt={3} alignItems={"center"} justify={"space-evenly"}>


                {
                    firstlog != null ?
                        <KpiCard title="Last Log" count={
                            // get minutes from now to last log
                            (Math.floor((new Date().getTime() - new Date(firstlog.logTimeStamp).getTime()) / 60000)).toString()
                        } />
                        : <KpiCard title="Last Log" count="0"  />

                }

                <KpiCard title="Total" count={data.length.toString()} />
                <KpiCard title="Errors" count={data.filter((log:any) => log.logLevel === 'ERROR').length} />
                <KpiCard title="Info" count={data.filter((log:any) => log.logLevel === 'INFO').length}/>
                <KpiCard title="Critical" count={data.filter((log:any) => log.logLevel === 'CRITICAL').length}/>
                <KpiCard title="Warning" count={data.filter((log:any) => log.logLevel === 'WARNING').length}/>
                <KpiCard title="Debug" count={data.filter((log:any) => log.logLevel === 'DEBUG').length}/>
            </Flex>
        </Box>

      <div className="flex flex-row justify-around mt-3 mx-5" style={{flex:"1", direction:"inherit",marginBottom:"5px", marginTop:"20px"}}>
          <PieChart data={pieChartData} options={pieChartOptions} />
          <BarChart data={barchartData} options={barChartOptions} />
      </div>

      <div className="flex flex-row justify-around mt-3 mx-5" style={{flex:"1", direction:"inherit",marginBottom:"5px", marginTop:"20px"}}>

            <Chart
                width={'100%'}
                height={'300px'}
                chartType="Calendar"
                loader={<div>Loading Chart</div>}
                data={calendarData}
                options={calendarOptions}
                rootProps={{ 'data-testid': '1' }}
            />


      </div>


        </Box>

            </div>

        </>
    )
}

export default Analytics;