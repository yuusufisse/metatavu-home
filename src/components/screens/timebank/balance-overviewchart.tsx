import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { PersonTotalTime } from "../../../generated/client";
import { workTimeDataOverview } from "../../../utils/chart-utils";
import { theme } from "../../../theme";

interface Props {
  personTotalTime: PersonTotalTime | undefined;
}

const BalanceOverviewChart = (props: Props) => {
  const { personTotalTime } = props;
  const domainStart = 1 * 60 * -20;
  const domainEnd = 1 * 60 * 40;

  return (
    <BarChart width={200} height={250} data={workTimeDataOverview(personTotalTime)}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="dataKey" domain={[domainStart, domainEnd]} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="project" stackId="a" fill={theme.palette.success.dark} />
      <Bar dataKey="nonBillableProject" stackId="a" fill={theme.palette.success.light} />
      <Bar dataKey="internal" stackId="a" fill={theme.palette.warning.main} />
      <Bar dataKey="expected" fill={theme.palette.info.main} />
    </BarChart>
  );
};

export default BalanceOverviewChart;
