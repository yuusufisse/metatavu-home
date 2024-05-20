import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer, Cell } from "recharts";
import { getHours, getHoursAndMinutes } from "src/utils/time-utils";
import { SprintViewChartData } from "src/types";
import strings from "src/localization/strings";

/**
 * Component properties
 */
interface Props {
  chartData: SprintViewChartData[];
}

/**
 * Sprint overview chart component
 * 
 * @param props component properties
 */
const SprintViewBarChart = ({chartData}: Props) => 
  <ResponsiveContainer 
    width="100%" 
    height={chartData.length===1 ? 100 : chartData.length*60 }>
    <BarChart	
      data={chartData} 
      layout="vertical" 
      barGap={0}	
      margin={{top: 0,	right: 0, left: 0, bottom: 0}}>
      <XAxis
        type="number"
        axisLine={false}
        tickFormatter={(value) => getHours(value as number)}
        domain={[0, (dataMax: number) => dataMax]}
        style={{fontSize: "18px"}}
        padding={{left:0, right:0}}
      />
      <YAxis 
        type="category" 
        dataKey="projectName" 
        tick={false} 
        hide={true}
      />
      <Tooltip content={<CustomTooltip/>} />
      <Bar 
        dataKey={"timeAllocated"} 
        name={"Time allocated"}  
        barSize={20}>
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
      <Bar 
        dataKey={"timeEntries"} 
        name={"Time entries"}	
        barSize={20}>
        {chartData.map((entry, index) => (
          <Cell style={{opacity: "0.5"}} key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>

export default SprintViewBarChart;

/**
 * Tooltip for chart component
 * 
 * @param payload project values
 * @param label name of the project
 */
const CustomTooltip = ({ payload, label }: any) => {
  if (payload.length) {
    return (
      <div style={{backgroundColor:"white", opacity:"0.8", borderRadius:"10px"}}>
        <p style={{padding:"10px 10px 0px 10px"}}>{label}</p>
        <p style={{padding:"0px 10px 0px 10px"}}>
          {strings.sprint.allocation}: {getHoursAndMinutes(payload[0].value as number)}
        </p>
        <p style={{padding:"0px 10px 10px 10px"}}>
          {strings.sprint.timeEntries}: {getHoursAndMinutes(payload[1].value as number)}
        </p>
      </div>
    );
  }
};