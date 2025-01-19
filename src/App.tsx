import DateRangePicker from "./components/DateRangePicker";

function App() {
  const predefinedRanges = [
    {
      label: "Last 7 Days",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: "This Month",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: "Last Month",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { startDate: start, endDate: end };
      },
    },
  ];

  const handleDateRangeChange = (
    dateRange: [string, string],
    weekends: string[]
  ) => {
    console.log("Selected date range:", dateRange);
    console.log("Weekends in range:", weekends);
  };

  return (
    <DateRangePicker
      onChange={handleDateRangeChange}
      predefinedRanges={predefinedRanges}
    />
  );
}

export default App;
