import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [walletBalance, setWalletBalance] = useState(undefined);
  const [ownerError, setOwnerError] = useState(false);
  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const atmBalance = (await atm.getBalance()).toNumber();
      setBalance(atmBalance);

      if (account) {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const wallet = provider.getSigner(account);
        const walletBalance = ethers.utils.formatEther(await wallet.getBalance());
        setWalletBalance(walletBalance);
      }
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const newOwner = async (newOwnerAdd) => {
    if (atm && newOwnerAdd) {
      try {
        let tx = await atm.newOwner(newOwnerAdd);
        await tx.wait();
        alert(`Ownership transferred to ${newOwnerAdd}`);
      } catch (error) {
        setOwnerError(true);
        setTimeout(() => {
          setOwnerError(false);
        }, 5000);
      }
    }
  };

  const verifyPin = async () => {
    if (atm && pin) {
      try {
        const isVerified = await atm.verifyPin(pin);
        setPinVerified(isVerified);
        setPinError(!isVerified); // Reset the pin error state
      } catch (error) {
        console.error(error);
        setPinError(true); // Set the pin error state
      }
    }
  };

  const handlePinChange = (event) => {
    setPin(event.target.value);
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Account Holder: {"Pawash Kumar"}</p>
        <p>Your Account: {account}</p>
        <p>ATM Balance: {balance} ETH</p>
        {walletBalance && <p>Wallet Balance: {walletBalance} ETH</p>}
        <button style = {{background: "cyan"}} onClick={deposit}><b>Deposit 1 ETH</b></button>
        <button style = {{background: "yellow"}} onClick={withdraw}><b>Withdraw 1 ETH</b></button>
        <button
        style = {{background: "orange"}}
          onClick={() => {
            const newOwnerAdd = prompt("Enter the new owner address:");
            newOwner(newOwnerAdd);
          }}
        >
          <b>New Owner</b>
        </button>
        {ownerError && <p className="error">Error: Failed to Add Another User!!!</p>}
        <div>
          <input type="text" value={pin} onChange={handlePinChange} placeholder="Enter PIN" />
          <button onClick={verifyPin}>Verify PIN</button>
          {pinError && <p className="error">Incorrect PIN. Please try again.</p>}
          {pinVerified && !pinError && <p>PIN is verified</p>}
        </div>
        
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header style = {{color: "blue"}}><h1>Welcome to the Crypto ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: Arial, sans-serif;
          text-align: center;
          transition: background-color 0.5s;
          background-color: #92a8d1;
        }

    
        
      `}
      </style>
    </main>
  );
}
