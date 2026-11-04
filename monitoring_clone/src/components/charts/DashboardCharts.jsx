import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";

const chartBase = {
  chart: { backgroundColor: "transparent", height: 190, spacing: [8, 4, 8, 4] },
  credits: { enabled: false },
  title: { text: undefined },
  legend: { enabled: false },
  tooltip: { shared: true, valueSuffix: "건" },
  accessibility: { enabled: false },
};

const createTypeChartOptions = ({ total, types }) => ({
  ...chartBase,
  chart: { ...chartBase.chart, type: "pie", height: 190 },
  title: {
    text: `${total.toLocaleString()}<small style="display:block;font-size:11px;color:#52617a;font-weight:500">전체</small>`,
    useHTML: true,
    align: "center",
    verticalAlign: "middle",
    y: 8,
    style: { color: "#15213a", fontSize: "20px", fontWeight: "700" },
  },
  plotOptions: {
    pie: {
      innerSize: "62%",
      dataLabels: { enabled: false },
      borderWidth: 2,
      borderColor: "#fff",
    },
  },
  tooltip: { pointFormat: "<b>{point.y}%</b>" },
  series: [{
    name: "민원 유형",
    data: types.map(({ name, value, color }) => ({ name, y: value, color })),
  }],
});

const createRegionChartOptions = (data) => ({
  ...chartBase,
  chart: { ...chartBase.chart, type: "bar", height: 190 },
  xAxis: {
    categories: data.map(({ name }) => name),
    lineWidth: 0,
    tickWidth: 0,
    labels: { style: { color: "#314057", fontSize: "11px" } },
  },
  yAxis: {
    min: 0,
    max: 350,
    tickAmount: 4,
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
});

const createTrendChartOptions = ({ categories, series }) => ({
  ...chartBase,
  chart: { ...chartBase.chart, type: "line", height: 190 },
  xAxis: {
    categories,
    tickLength: 0,
    lineColor: "#e2e8f1",
    labels: { style: { color: "#314057", fontSize: "9px" } },
  },
  yAxis: {
    min: 0,
    max: 750,
    tickAmount: 4,
    title: { text: undefined },
    gridLineColor: "#e2e8f1",
    labels: { style: { color: "#314057", fontSize: "9px" } },
  },
  plotOptions: {
    series: {
      lineWidth: 2,
      marker: { enabled: true, radius: 4 },
    },
  },
  legend: {
    enabled: true,
    align: "right",
    verticalAlign: "top",
    itemStyle: { color: "#314057", fontSize: "10px", fontWeight: "400" },
  },
  series,
});

const Chart = ({ options }) => (
  <HighchartsReact highcharts={Highcharts} options={options} />
);

export const ComplaintTypeChart = ({ data }) => (
  <Chart options={createTypeChartOptions(data)} />
);
export const RegionComplaintChart = ({ data }) => (
  <Chart options={createRegionChartOptions(data)} />
);
export const ProcessingTrendChart = ({ data }) => (
  <Chart options={createTrendChartOptions(data)} />
);
