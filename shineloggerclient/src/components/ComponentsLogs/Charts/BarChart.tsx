import { Chart } from "react-google-charts";


const BarChart = ({data,options}:any) => {
    return (
        <div className="flex flex-1 justify-center m-4" style={{width:"400px",height:"400px", minHeight:"400px",maxHeight:"400px",border:"gray",borderStyle:"-moz-initial",borderRadius:"50px",color:"black"}}>
            <Chart
                width={'500px'}
                height={'400px'}
                chartType="Bar"
                loader={<div>Loading Chart</div>}
                data={data}
                options={options}
                // For tests
                rootProps={{ 'data-testid': '2' }}
            />
        </div>
    )
}

export default BarChart;