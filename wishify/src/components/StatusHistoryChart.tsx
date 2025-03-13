import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const StatusHistoryChart = ({historyData}: {historyData: {time: string, testsPassedPercent: number, index?: number}[]}) => {
  
    let dataMin: number = 80
    historyData.forEach(item => {
            dataMin = Math.min(dataMin, item.testsPassedPercent)
        }
    )

    return (
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="time"
                tickFormatter={(value) => {
                  return value.slice(0,7)
                }}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[dataMin, 100]}
                tickCount={6}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload
                    return (
                      <div className="bg-background border rounded-md shadow-md p-2">
                        <div className="font-medium">{dataPoint.time}</div>
                        <div className="text-sm text-muted-foreground">
                          Pass Rate: <span className="font-medium">{dataPoint.testsPassedPercent}%</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="testsPassedPercent" stroke="#000000" />
              
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
}

export default StatusHistoryChart