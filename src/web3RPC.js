import Web3 from "web3";
import contractAbi from './utils/contractAbi';
export default class RPC {
  constructor(provider) {
    this.provider = provider;
  }

  async getChainId() {
    try {
      const web3 = new Web3(this.provider);

      // Get the connected Chain's ID
      const chainId = await web3.eth.getChainId();
      console.log(web3);
      return chainId.toString();
    } catch (error) {
      return error;
    }
  }

  async getAccounts() {
    try {
      const web3 = new Web3(this.provider);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      return address;
    } catch (error) {
      return error;
    }
  }
  async getBalance() {
    try {
      const web3 = new Web3(this.provider);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      // Get user's balance in ether
      const balance = web3.utils.fromWei(
        // await web3.eth.getBalance('0xD8e14AE66A154Bac257c43Cdbd1c72F176BF74B5') // Balance is in wei
        await web3.eth.getBalance(address) // Balance is in wei
      );

      return balance;
    } catch (error) {
      return error;
    }
  }

  async signMessage(){

    try{
      const web3 = new Web3(this.provider);
      const fromAddress = (await web3.eth.getAccounts())[0];
      const originalMessage = [
        {
          type: 'string',
          name: 'signMessageString',
          value: 'Hello signing example',
        }
      ];
      const params = [originalMessage, fromAddress];
      const method = 'eth_signTypedData';
      const signedMessage = await web3.currentProvider?.sendAsync({
        id: 1,
        method,
        params,
        fromAddress,
      });
    return signedMessage;
    }catch(error){
      return error
    }
  }

  async signTypedData(setTypedData){
    try{
      const web3 = new Web3(this.provider);
        const signer = (await web3.eth.getAccounts())[0];
        const domain = [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "verifyingContract", type: "address" },
        ];
        const domainData = {
            name: "Ether Mail",
            version: "1",
            //   chainId: 1,
            verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        };
        const value = {
            from: {
                name: "Cow",
                wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            },
            to: {
                name: "Bob",
                wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
            },
            contents: "Hello, Bob!",
        };
        const types = {
            Person: [
                { name: "name", type: "string" },
                { name: "wallet", type: "address" },
            ],
            Mail: [
                { name: "from", type: "Person" },
                { name: "to", type: "Person" },
                { name: "contents", type: "string" },
            ],
        };
        const data = JSON.stringify({
            types: {
                EIP712Domain: domain,
                Person: types.Person,
                Mail: types.Mail,
            },
            domain: domainData,
            primaryType: "Mail",
            message: value
        });
       const signedTypedData =await web3.currentProvider.sendAsync(
            {
                method: "eth_signTypedData_v3",
                params: [signer, data],
                from: signer
            });
          return signedTypedData;
    }catch(err){
        return err
    }
}
  async sendTransaction() {
    try {
      const web3 = new Web3(this.provider);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const destination = "0x70Ce7CaaFf7c45D195411468Dc5D20E4aCfb3f2d";

      const amount = web3.utils.toWei("0.001"); // Convert 1 ether to wei
      console.log(web3.givenProvider);
      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        value: amount,
        // value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });

      return receipt;
    } catch (error) {
      return error;
    }
  }
  async sendContractTransaction() {
    try {

      const web3 = new Web3(this.provider);

      var tokenContract = new web3.eth.Contract(
        contractAbi,
        "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
      );
      console.log(tokenContract);
      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const response = await tokenContract.methods
        .approve(fromAddress, "20000000000000000000")
        .send(
          {
            from: fromAddress,
          },
          function (error, transactionHash) {
            if (transactionHash) {
              console.log(transactionHash);

              // setApproveCase(3);
            } else {
              console.log(error);
            }
          }
        )
        .on("receipt", async function (receipt) {
          console.log(receipt);
        })
        .on("error", async function (error) {
          console.log(error);
        });
      return response;
    } catch (error) {
      return error;
    }
  }
  async getNameOfToken() {
    try {
    
      const web3 = new Web3(this.provider);

      const smartContractInstance = new web3.eth.Contract(
        contractAbi,
        "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844"
      );
      return await smartContractInstance.methods.name().call();
    } catch (error) {
      return error;
    }
  }

  async getPrivateKey() {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error;
    }
  }
}
