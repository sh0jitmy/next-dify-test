import {useState,useRef,useEffect} from 'react'

interface EventSourceType {
    event: string;
    workflow_run_id: string;
    task_id: string;
    data: {
        text?: string;
        node_type?: string
        outputs?: {
            result?: string;
            [key: string]: unknown; };
        [key: string]: unknown;};
    [key: string]: unknown;}


export function useWorkflowStream() {
    const [input,setInput] = useState("")
    const[output,setOutput] = useState("")
    const eventSourceRef = useRef<EventSource | null>(null)  //blocking re-render
    const completeTextRef = useRef("") //blocking re-render

    const callDifyApi = () => {
        if (!input.trim()) return
        setOutput('Process Start')
        completeTextRef.current = ''

        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }
        const url = `/api/workflow-stream?query=${input}&userId=user-123`
        const eventSource = new EventSource(url)
        eventSourceRef.current = eventSource

        eventSource.onmessage = (event) => {
            try{
                const eventData = JSON.parse(event.data)
                handleEventData(eventData)
            }catch(error){
                console.error('Data Analyze Error', error,event.data)
            }
        }
        eventSource.onerror = (error) => {
            console.error("Event Get Error",error)
            eventSource.close()
        }
    } // start streaming
    const handleEventData = (eventData: EventSourceType) =>{
        console.log("Event Received",eventData.event)
        if(eventData.event === "text_chunk") {
            appendText(eventData.data.text as string)
        }
        if(eventData.event === "workflow_finished") {
            if(completeTextRef.current === "" ||
              completeTextRef.current === "Process Start") {
                appendText(eventData.data.outputs?.result as string)
            }
            if(eventSourceRef.current) eventSourceRef.current.close();
        }
    } ;// process event data
    //const extractTextContent = () =>{}  // extract text
    const appendText = (text: string) =>{
        if(!text.trim()) return
        completeTextRef.current += text;
        setOutput(completeTextRef.current);
    } //append text to output
    useEffect(()=>{
        return () => {
            if (eventSourceRef.current)
                    eventSourceRef.current.close()
        }
    },[])//clean up

    return {
        input,setInput,output,callDifyApi
    }
}
