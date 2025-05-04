'use client'
import {useState} from "react"
import {Button} from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Textarea } from "./ui/textarea"
import { buttonVariants } from "./ui/button"


export default function WorkflowBlocking() {
    const [input, setInput] = useState('')
    const [output,setOutput] = useState('')
    const callDifyApi = async() => {
        if(!input.trim()) return
        setOutput('')

        try{
            const response = await fetch('/api/workflow-block',{
                method: "POST",
                headers : {'Content-Type':'application/json'},
                body : JSON.stringify({query:input})
            })
            const result = await response.json()
            setOutput(result)
        }catch(error) {
            console.error("API Connect Error")
            setOutput("API Call Error")
        }
    }
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Dify Workflow API</CardTitle>
                <CardDescription>Dify Simple Workflow </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                placeholder="質問を入力してください"
                value={input}
                onChange={(e)=> setInput(e.target.value)}
                rows={4}
                className="w-full text-base md:text-base mb-8"
                />
                { output && (
                    <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="text-sm font-medium mb-2">回答：</h3>
                        <p className="whitspace-pre-wrap text-base md:text-base">{output}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={callDifyApi} className="w-full">送信</Button>
            </CardFooter>
        </Card>
    )
}
