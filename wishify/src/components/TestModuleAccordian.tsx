import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { FaChevronDown, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"
import { FaCircleXmark } from "react-icons/fa6";


const TestModuleAccordian = ({module}: {module: {name: string, tests: {name: string, outcome: string}[]}}) => {
  
    let outcome: "passed" | "error" | "failed" = "passed" 
    module.tests.forEach(test => {
        if(test.outcome === "error" && outcome !== "failed") outcome = "error"
        if(test.outcome === "failed") outcome = "failed"
    })
  
    return (
    <Accordion key={module.name}>
        <AccordionSummary expandIcon={<FaChevronDown />}>
            <div className="flex items-center justify-between w-full pr-4">
                {module.name}
                {outcome === "passed" ? <FaCheckCircle className="text-green-500" /> :
                    outcome === "error" ? <FaExclamationTriangle className="text-amber-500" /> :
                    <FaCircleXmark className="text-red-500" />
                }
            </div>
        </AccordionSummary>
        <AccordionDetails>
            {module.tests.map(test => {
                console.log(test)
                return(
                    <div key={test.name} className={`mb-2 text-lg p-3 rounded-md flex justify-between items-center ${test.outcome === "passed" ? "bg-green-50" : test.outcome === "error" ? "bg-amber-50" : "bg-red-50"}`}>
                        {test.name}
                        {test.outcome === "passed" ? <FaCheckCircle className="text-green-500" /> :
                            test.outcome === "error" ? <FaExclamationTriangle className="text-amber-500" /> :
                            <FaCircleXmark className="text-red-500" />
                        }
                    </div>
                )
            })
            }
        </AccordionDetails>
    </Accordion>
  )
}

export default TestModuleAccordian