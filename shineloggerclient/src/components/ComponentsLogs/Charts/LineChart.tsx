import { Chart } from "react-google-charts";

const LineChart = ({data,options}:any) => {
    return (
        <div className="m-2 flex-1" style={{width:"300px",height:"30px",maxHeight:"50px"}}
        >
            <Chart
                width={'100%'}
                height={'100%'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={data}
                options={options}

                 />
        </div>
    )
}

export default LineChart;