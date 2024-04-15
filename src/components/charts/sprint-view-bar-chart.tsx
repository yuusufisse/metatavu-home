import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer, Cell } from "recharts";
import { theme } from "../../theme";
import { getHours, getHoursAndMinutes } from "../../utils/time-utils";
import { SprintViewChartData } from "../../types";

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
const SprintViewBarChart = ({chartData}: Props) => {
	return (
		<ResponsiveContainer width="100%" height={chartData.length===1 ? 100 : chartData.length*40 }>
			<BarChart	data={chartData} layout="vertical" barGap={0}	margin={{top: 10,	right: 0, left: 0, bottom: 0}}>
				<XAxis
					type="number"
					axisLine={false}
					tickFormatter={(value) => getHours(value as number)}
					domain={[0, (dataMax: number) => dataMax]}
					style={{fontSize: "18px"}}
					padding={{left:0, right:0}}
				/>
				<YAxis type="category" dataKey="projectName" tick={false} hide={true}/>
				<Tooltip formatter={(value) => getHoursAndMinutes(value as number)}/>
				<Bar dataKey={"timeAllocated"} name={"Time allocated"}	barSize={40} stackId="stackedBar"	fill={theme.palette.grey.A700}>
					{chartData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};



export default SprintViewBarChart;
