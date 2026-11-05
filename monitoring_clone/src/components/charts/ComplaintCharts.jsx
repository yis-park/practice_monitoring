import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";

export const ComplaintTypeSummaryChart = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: { type: "pie", backgroundColor: "transparent", height: 190 },
      credits: { enabled: false },
      title: {
        text: `${data.total}<small style="display:block;font-size:11px;color:#52617a;font-weight:500">전체</small>`,
        useHTML: true,
        align: "center",
        verticalAlign: "middle",
        y: 8,
        style: { color: "#15213a", fontSize: "20px", fontWeight: "700" },
      },
      tooltip: { pointFormat: "<b>{point.y}%</b>" },
      accessibility: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: "62%",
          dataLabels: { enabled: false },
          borderWidth: 2,
          borderColor: "#fff",
        },
      },
      series: [
        {
          name: "민원 유형",
          data: data.types.map(({ name, value, color }) => ({
            name,
            y: value,
            color,
          })),
        },
      ],
    }}
  />
);

export const RegionSummaryChart = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "bar",
        backgroundColor: "transparent",
        height: 190,
        spacing: [8, 8, 8, 4],
      },
      credits: { enabled: false },
      title: { text: undefined },
      accessibility: { enabled: false },
      xAxis: {
        categories: data.map(({ name }) => name),
        lineWidth: 0,
        tickWidth: 0,
        labels: { style: { color: "#314057", fontSize: "11px" } },
      },
      yAxis: {
        min: 0,
        max: 80,
        tickAmount: 5,
        title: { text: undefined },
        gridLineColor: "#e2e8f1",
        labels: { style: { color: "#71809a", fontSize: "10px" } },
      },
      plotOptions: {
        series: {
          borderRadius: 4,
          pointWidth: 13,
          color: "#4387ef",
          dataLabels: {
            enabled: true,
            format: "{y}건",
            style: { color: "#243149", fontSize: "10px", textOutline: "none" },
          },
        },
      },
      tooltip: { pointFormat: "<b>{point.y}건</b>" },
      series: [{ name: "민원 수", data: data.map(({ value }) => value) }],
    }}
  />
);
