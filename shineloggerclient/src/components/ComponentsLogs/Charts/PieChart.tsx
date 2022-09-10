import { Chart } from "react-google-charts";

const PieChart = ({data,options}:any) => {
    return (
        <div className="flex flex-1 justify-center m-2 border rounded" style={{width:"200px",height:"400px", minHeight:"400px",maxHeight:"400px",border:"gray",borderStyle:"-moz-initial",borderRadius:"50px",color:"black"}}>
            <Chart
                width={'300px'}
                height={'350px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={data}
                options={options}
                rootProps={{ 'data-testid': '1' }}
            />
        </div>
    )
}

export default PieChart;