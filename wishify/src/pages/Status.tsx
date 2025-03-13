import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CircularProgress } from "@mui/material"
import StatusHistoryChart from "../components/StatusHistoryChart"
import TestModuleAccordian from "../components/TestModuleAccordian"

const Status = () => {

  interface StatusData {
    time: string,
    summary: {
        passed: number,
        error: number,
        failed: number
    },
    modules: {
        name: string,
        tests: {name: string, outcome: string}[]
    }[],
    history: {time: string, testsPassedPercent: number}[]
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [statusData, setStatusData] = useState<StatusData>({
    time:"default",
    summary: {
        passed: 0,
        error: 0,
        failed: 0
    },
    modules: [],
    history: []
  })
  
  const [currentPassRate, setCurrentPassRate] = useState<number>()
  const [passedTests, setPassedTests] = useState<number>()
  const [errorTests, setErrorTests] = useState<number>()
  const [failedTests, setFailedTests] = useState<number>()
  const [totalTests, setTotalTests] = useState<number>()

  // fetch status data
  useEffect(() => {
    const url = "https://api.wishify.ca/status"

    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        setStatusData(data);
        setLoading(false)
      })
      .catch((error) => {
        alert("Error fetching status" + error)
      })
  },[])

  // update state variables from statusData
  useEffect(() => {
    if(loading) return

    setCurrentPassRate(
        Math.round(
            statusData.summary.passed
            / (statusData.summary.passed
                 + statusData.summary.error
                 + statusData.summary.failed
              ) 
            * 100
        )
    )
    setPassedTests(statusData.summary.passed)
    setErrorTests(statusData.summary.error)
    setFailedTests(statusData.summary.failed)
    setTotalTests(statusData.summary.passed + statusData.summary.error + statusData.summary.failed)
  },[statusData])


  return (
    <section>
      {loading ?
            <CircularProgress />
      :
          <div className="space-y-5 pt-1">
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">API Status Dashboard</h1>
                <p className="text-gray-600">Monitoring automated API test results across all systems</p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader 
                        title="Recent Pass Rate"
                        className="text-gray-600"
                        sx={{paddingBottom:0}}
                        slotProps={{title:{fontSize:20}}}
                    />
                    <CardContent className="text-5xl ml-4">{currentPassRate}%</CardContent>
                </Card>

                <Card>
                    <CardHeader 
                        title="Total Tests"
                        className="text-gray-600"
                        sx={{paddingBottom:0}}
                        slotProps={{title:{fontSize:20}}}
                    />
                    <CardContent className="text-5xl ml-4">{totalTests}</CardContent>
                </Card>

                <Card>
                    <CardHeader 
                        title="Passed"
                        className="text-gray-600"
                        sx={{paddingBottom:0}}
                        slotProps={{title:{fontSize:20}}}
                    />
                    <CardContent className="text-5xl ml-4 text-green-500">{passedTests}</CardContent>
                </Card>

                <Card>
                    <CardHeader 
                        title="Failed / Errors"
                        className="text-gray-600"
                        sx={{paddingBottom:0}}
                        slotProps={{title:{fontSize:20}}}
                    />
                    <CardContent className="text-5xl">
                        <span className="text-red-500 p-4">{failedTests}</span>
                        /
                        <span className="text-amber-500 p-4">{errorTests}</span>
                    </CardContent>
                </Card>
                
            </div>

            <Card>
                <CardHeader 
                        title={`Pass Rate Trend (Last ${statusData.history.length} Test Runs)`}
                        subheader="Percentage of tests passing over time"
                        className="text-gray-600"
                        sx={{paddingBottom:0}}
                        slotProps={{title:{fontSize:20}}}
                    />
                <CardContent>
                <div className="h-[300px]">
                    <StatusHistoryChart historyData={statusData.history.slice().reverse()}/>
                </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader 
                    title="Test Categories"
                    subheader="Expand each category to see individual test results"
                    className="text-gray-600"
                    sx={{paddingBottom:0}}
                    slotProps={{title:{fontSize:20}}}
                />
                <CardContent>
                    {statusData.modules.map(module => {
                            return <TestModuleAccordian module={module} />
                        }) 
                    }

                </CardContent>
            </Card>
            


          </div>
          
      }
    </section>
  )
}

export default Status