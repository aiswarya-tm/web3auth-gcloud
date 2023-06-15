import './App.css';
import { Web3Auth } from '@web3auth/modal';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from './web3RPC';

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState('');

  const [consoleDate, setConsoleDate] = useState('console log');
  const separator = '\n\n-------------------------------------------------------------\n\n';

  useEffect(() => {
    const init = async () => {
      try {
        //Initialize within your constructor
        const web3auth = new Web3Auth({
          // type uiConfig
          uiConfig: {
            appLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/2048px-Overwatch_circle_logo.svg.png",
            // appLogo: 'https://images.web3auth.io/web3auth-logo-w.svg',
            theme: 'dark',
            loginMethodsOrder: ['google','facebook','github'],
            defaultLanguage: 'en',
          },
          web3AuthNetwork:"testnet",
          clientId: 'BLBf77Z-iw8CU0ca5mb77r2LzPn3yEC_uMmrRw9c2qZhRnTcjRhGF7dtcGmEPLfJwycWq9meFuaf-DPwzd7SiWE', // Get your Client ID from Web3Auth Dashboard
          chainConfig: {
            chainNamespace: 'eip155',
            chainId: '0x5',
          },
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "default", // Pass on the mfa level of your choice: default, optional, mandatory, none
          },
          adapterSettings: {
            network: "testnet",
            whiteLabel: {
              name: "Over Watch",
              logoLight: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/2048px-Overwatch_circle_logo.svg.png",
              logoDark: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/2048px-Overwatch_circle_logo.svg.png",
              // logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              // logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              defaultLanguage: "en",
              dark: true, // whether to enable dark mode. defaultValue: false
            },
          }
        });
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);
        // await web3auth.initModal();
        // setProvider(web3auth.provider);

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                google: {
                  name: "google login",
                  logoDark: "url to your custom logo which will shown in dark mode",
                },
                facebook: {
                  // it will hide the facebook option from the Web3Auth modal.
                  showOnModal: true,
                },
                github: {
                  // it will hide the facebook option from the Web3Auth modal.
                  showOnModal: true,
                },
                
              },
              // setting it to false will hide all social login methods from modal.
              showOnModal: true,
            },
          },
        });

        if (web3auth.provider) {
          setProvider(web3auth.provider);
      };

      } catch (error) {
        console.error(error);
        toast.error('Something went Wrong');
      }
    };
    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      toast.error('web3auth not initialized yet');
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setConsoleDate(`Logged In`);
    toast.success('Connected');
  };

  const logout = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    try {
      const web3authProvider = await web3auth.logout();
      setProvider(web3authProvider);
      setAddress('');
      setConsoleDate(
          `
      setProvider(web3authProvider);
      setAddress("");
      setUserData({});

user details cleared & logged out
        `
      );
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      toast.error('web3auth not initialized yet');
      return;
    }
    const user = await web3auth.getUserInfo();
    setConsoleDate(`User Info - \n ${JSON.stringify(user)}`);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    setConsoleDate(`Chain Id - ${chainId}`);
    console.log(chainId);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    setConsoleDate(`Account address is - ${address}`);
    setAddress(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    setConsoleDate(`Balance - ${balance}`);
    console.log(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    try{
      const rpc = new RPC(provider);
      const message = await rpc.signMessage();
      setConsoleDate(`Signed message(Hello signing example) - ${message}`);
    }catch(err){
      setConsoleDate(err.message);
    }

  }

  const signTypedData = async()=>{
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    try{
      const rpc = new RPC(provider);
      const message = await rpc.signTypedData();
      setConsoleDate(`Signing typed data - ${message}`);
    }catch(err){
      setConsoleDate(err.message);
    }
  }

  const sendTransaction = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    try {
      const rpc = new RPC(provider);
      const receipt = await rpc.sendTransaction();
      setConsoleDate(`Receipt is - \n ${JSON.stringify(receipt)} \n${separator}Goerli link is - \n https://goerli.etherscan.io/tx/${receipt.transactionHash}`);
      console.log(receipt);
      if (receipt.data.message === 'INTERNAL_ERROR: insufficient funds') {
        toast.error('INTERNAL_ERROR: insufficient funds');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sendContractTransaction = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendContractTransaction();
    setConsoleDate(`Receipt is - \n ${JSON.stringify(receipt)} \n${separator}Goerli link is - \n https://goerli.etherscan.io/tx/${receipt.transactionHash}`);
    console.log(receipt);
  };
  const getName = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.getNameOfToken();
    setConsoleDate(`Name is - ${receipt}`);
    console.log(receipt);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      toast.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    setConsoleDate(`Private Key - ${privateKey}`);
    console.log(privateKey);
  };
  const clearConsole = async () => {
    setConsoleDate('');
    console.log('console cleared');
  };


  return (
    <div className="App">
      <div className="connection-buttons">
      <div className='pnp'><p>web3Auth Plug & Play </p></div>
        {address ? address : <p>address</p>}
        <button className="connection-buttons-login" onClick={login}>
          Login
        </button>
        <button className="connection-buttons-logout" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="function-buttons">
        {provider ? <p>Provider Set</p> : <p>Provider Not Set</p>}
        <p>User Details</p>
        <button onClick={getUserInfo}>getUserInfo</button>
        <button onClick={getAccounts}>getAccounts</button>
        <button onClick={getBalance}>getBalance</button>
        <button onClick={getPrivateKey}>getPrivateKey</button>
        <button onClick={getChainId}>getChainId</button>
        <p>User specific transactions</p>
        <button onClick={signMessage}>sign</button>
        <button onClick={signTypedData}>sign Message</button>
        <button onClick={sendTransaction}>Send 0.001eth</button>
        <p>Contract Interactions</p>
        <button onClick={getName}>get Token Name</button>
        <button onClick={sendContractTransaction}>Approve Token</button>
        
      </div>
      <div className="log-space">
        <textarea className="log-space-content" value={consoleDate}></textarea>
        <button onClick={clearConsole}>clearConsole</button>
      </div>
      <header className="App-header"></header>
      <Toaster />
    </div>
  );
}

export default App;
