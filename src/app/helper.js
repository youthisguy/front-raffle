// get recent winner
export const getWinner = async (setWinner) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenSaleContract, tokenSaleABI, signer);
  
      try {
        // debugger;
        const response = await contract.raised();
        const bal = Number(BigNumber.from(`${response._hex}`).toString()) / 10 ** 18;
        setRaised(bal);
      } catch (error) {
        console.log('error', error);
      }
    }
  };