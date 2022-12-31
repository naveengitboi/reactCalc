import {React, useReducer} from "react";
import './App.css'
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
    ADD_DIGIT:'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT:'delete-digit',
    EVALUATE:'evaluate'
}
function reducer(state,{type, payload}){
    console.log(payload)
    switch(type){
        
        case ACTIONS.ADD_DIGIT:
            if(state.overwrite){
                return{
                    ...state, 
                    currentOperand: payload.digit, 
                    overwrite:false
                }
            }
            if (payload.digit === '0' && state.currentOperand === '0') {return state}

            if(payload.digit === "." && state.currentOperand.includes(".")) {return state}

            return{
                ...state,
                 currentOperand: `${state.currentOperand || ""}${payload.digit}`
            }
        case ACTIONS.CLEAR:
            return {}
        case ACTIONS.CHOOSE_OPERATION:
            if(state.currentOperand == null) {
                return {
                    ...state,
                     operation: payload.operation
                }
            }
            if(state.currentOperand == null && state.prevOperand == null) return state 
            if(state.prevOperand == null ) 
            return {
                ...state, 
                operation:payload.operation,
                prevOperand : state.currentOperand,
                currentOperand:null,
            }
            return{
                ...state, 
                prevOperand : evaluate(state),
                operation : payload.operation,
                currentOperand : null
            }
        case ACTIONS.DELETE_DIGIT:
             
             if(state.overwrite){
                 return {
                     ...state, 
                     overwrite:false,
                     currentOperand:null
                 }
             }
             if(state.currentOperand == null) {return state }
             if(state.currentOperand.length == 1) {
                 return{
                     ...state, 
                     currentOperand:null
                 }
             }

             return {
                 ...state, 
                 currentOperand: state.currentOperand.slice(0,-1)
             }
    
        case ACTIONS.EVALUATE :
            if(state.currentOperand == null || state.prevOperand == null || state.operation == null)
            {
                return state
            }

            return{
                ...state, 
                prevOperand:null,
                overwrite: true,
                operation:null,
                currentOperand: evaluate(state),
                
            }
        
            
    }
}

function evaluate({currentOperand, prevOperand, operation}){
    const prev = parseFloat(prevOperand)
    const current = parseFloat(currentOperand)
    if(isNaN(prev) || isNaN(current)) return '' 
    let compute 
    switch(operation){
        case "+":
            compute = prev + current
            break;
        case "-":
            compute = prev - current
            break;
        case "*":
            compute = prev * current
            break;
        case "/":
            compute = prev / current
            break;
    }
    return compute.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits:0,
})
function formatOperand(operand){
    if(operand == null) return 
    const [integer, decimal] = operand.split(".")
    if(decimal == null) return INTEGER_FORMATTER.format(integer)
}
function App() {


    const [{currentOperand, prevOperand,operation}, dispatch] = useReducer(reducer, {})



    return ( 
        <div className="container">
            <div className="output">
                <div className="operandOne">{formatOperand(prevOperand)} {operation}</div>
                <div className="operandTwo">{formatOperand(currentOperand)}</div>
            </div>

            <button className="spanTwo" onClick={() => dispatch({type:ACTIONS.CLEAR})}>AC</button>
            <button onClick={() => dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
            <OperationButton operation="/" dispatch ={dispatch}/>
            <DigitButton digit="1" dispatch ={dispatch}/>
            <DigitButton digit="2" dispatch ={dispatch}/>
            <DigitButton digit="3" dispatch ={dispatch}/>
            <OperationButton operation="*" dispatch ={dispatch}/>
            <DigitButton digit="4" dispatch ={dispatch}/>
            <DigitButton digit="5" dispatch ={dispatch}/>
            <DigitButton digit="6" dispatch ={dispatch}/>
            <OperationButton operation="+" dispatch ={dispatch}/>
            <DigitButton digit="7" dispatch ={dispatch}/>
            <DigitButton digit="8" dispatch ={dispatch}/>
            <DigitButton digit="9" dispatch ={dispatch}/>
            <OperationButton operation="-" dispatch ={dispatch}/>
            <DigitButton digit="." dispatch ={dispatch}/>
            <DigitButton digit="0" dispatch ={dispatch}/>
            <button className="spanTwo" onClick={() => dispatch({type:ACTIONS.EVALUATE})}>=</button>
        </div>
     );
}

export default App;