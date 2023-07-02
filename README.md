# INTEGRATING SMART CONTRACT WITH FRONTEND
This is a solidity contract which is integrated with the react to display data on the frontend. User can connect their Metamask Wallet, view their account balance, deposit or withdraw Ether and check the user's name.
## Features

The following features ar provided by the Project :

- Check the user's name
- Connect to MetaMask wallet
- Display user's account address
- View user's account balance
- Deposit ETH into the ATM
- Withdraw ETH from the ATM
  
Please note that the component assumes you have set up and configured MetaMask in your browser.

## Getting Started

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

On the Frontend window , you will be able to interact with the components and deposit or withdraw ETH from metamask wallet.
### `Deposit` 
-- Helps to deposit ETH in the current metamask wallet
### `Withdraw` 
-- Helps to withdraw ETH from the metamask wallet

## Authors

Pawash Kumar Singh
pawash97@gmail.com

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Video Walkthrough
