import { contractAddress } from "./constants.js";
import { ethers } from "./ethersfile.esm.min.js";
import {abi} from './constants.js';


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const BalanceButton = document.getElementById("BalanceButton")
const WithdrawButton = document.getElementById("WithdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
BalanceButton.onclick = getBalance
WithdrawButton.onclick = withdraw

console.log(ethers)

async function connect(){
    if(window.ethereum){
    await window.ethereum.request({method: "eth_requestAccounts"})
    document.getElementById("connectButton").innerHTML = "Connected"
    console.log("You are connected now")
    }
    else{
    document.getElementById("connectButton").innerHTML = "Please Install metamask"
}
}

async function getBalance(){
    if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log("hello")
        console.log(ethers.utils.formatEther(balance))
    }
    else{
        console.log("get metamask")
    }
}

async function withdraw(){
    if(window.ethereum){
        console.log("Withdrawing.......")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        }
        catch(error){
            console.log(error)
        }
    }
    else{
        console.log("get metamask")
    }
}

async function fund(){
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}...`)
    if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try{
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })
        await listenForTransactionMine(transactionResponse, provider)
        console.log("done")
    }
    catch(error){
        console.log(error)

    }
    }

}   

function listenForTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}......`)
    return new Promise((resolve, reject) =>{
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations...`)
            resolve()
        })
    })
    
    //return new Promise()
}