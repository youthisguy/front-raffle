"use client"

import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import { useWriteContract } from 'wagmi'
import { parseEther } from "viem";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RaffleAddress = '0xA2e48f1dB93592be6E28636E2D5254F705633c61'
const RaffleAbi = [{"inputs":[{"internalType":"address","name":"vrfCordinatorV2","type":"address"},{"internalType":"uint256","name":"entranceFee","type":"uint256"},{"internalType":"bytes32","name":"gasLane","type":"bytes32"},{"internalType":"uint64","name":"subscriptionId","type":"uint64"},{"internalType":"uint256","name":"interval","type":"uint256"},{"internalType":"uint32","name":"callbackGasLimit","type":"uint32"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"currentBalance","type":"uint256"},{"internalType":"uint256","name":"numPlayers","type":"uint256"},{"internalType":"uint256","name":"raffleState","type":"uint256"}],"name":"Lottery_UpkeepNotNeeded","type":"error"},{"inputs":[],"name":"Lottery__NotEnoughETHEntered","type":"error"},{"inputs":[],"name":"Lottery__NotOpen","type":"error"},{"inputs":[],"name":"Lottery__TransferFailed","type":"error"},{"inputs":[{"internalType":"address","name":"have","type":"address"},{"internalType":"address","name":"want","type":"address"}],"name":"OnlyCoordinatorCanFulfill","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"}],"name":"LotteryEnter","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"participant","type":"address"}],"name":"RaffleEnter","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"RequestedRaffleWinner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"}],"name":"WinnerPicked","type":"event"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"checkUpkeep","outputs":[{"internalType":"bool","name":"upkeepNeeded","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"enterRaffle","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getEntranceFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestTimeStamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumWords","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getNumberOfplayers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getPlayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRaffleState","outputs":[{"internalType":"enum Raffle.RaffleState","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRecentWinner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRequestConfimations","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"performUpkeep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"},{"internalType":"uint256[]","name":"randomWords","type":"uint256[]"}],"name":"rawFulfillRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export default function Home() {
  const [transactionHash, setTransactionHash] = useState('');
  const notifySuccess = () => toast.success('Transaction successful! Raffle entry submitted.');
  const notifyError = () => toast.error('Transaction failed!');
  const { writeContractAsync, isPending } = useWriteContract();


  const handleRaffleEntryClick = async () => {
    try {
      const data = await writeContractAsync({
        address: RaffleAddress,
        abi: RaffleAbi,
        functionName: 'enterRaffle',
        value: parseEther("0.01"),
        args: [],
      });
      setTransactionHash(data);
      notifySuccess();
      console.log('Transaction successful! Raffle entry submitted: hash', data);
    } catch (err) {
      console.error(err);
      notifyError();
    }
  };
  const result = useReadContract({
    abi: RaffleAbi,
    address: RaffleAddress,
    functionName: 'getNumberOfplayers'
  })

  const winner = useReadContract({
    abi: RaffleAbi,
    address: RaffleAddress,
    functionName: 'getRecentWinner'
  })

  const { data: numberOfPlayers } = result;
  const { data: lastWinner } = winner;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <ToastContainer />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
         Join Decentralized Lottery game - &nbsp;
          <code className="font-mono font-bold">1 Lucky Winner!</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <w3m-button />
        </div>
      </div>

      <div className="relative cursor-pointer flex place-items-center">
 
</div>
 <h1>The previous winner is {lastWinner?.toString()}</h1>
 {transactionHash && (
  <div>
    Transaction Hash: {' '}
    <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className='text-blue-500 font-bold'>
      {transactionHash}
    </a>
  </div>
)}
  <button class="font-bold bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" disabled={isPending} onClick={handleRaffleEntryClick}>Join Lottery</button>
 <h2>Number of participants: {numberOfPlayers?.toString()} </h2>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Step 1{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
             Connect Wallet
          </p>
        </a>

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Step Two{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Click "Join Lottery" and Approve Transaction in your wallet. <span className={`text-red-500 font-bold`}>Entrance Fee = 0.01 ETH</span>
          </p>
        </a>

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Step Three{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Wait to countdown to expire, Lucky Winner is Selected by Smart Contract by Random after countdown expires.
          </p>
        </a>

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Step Four{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
           Check to see is you're the Lucky Winner. Tokens will be sent automatically to winner's wallet!
          </p>
        </a>
      </div>
    </main>
  );
}
