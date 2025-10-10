import { PublicKey } from "@solana/web3.js";
import Client, { SubscribeRequest, SubscribeUpdate } from "@triton-one/yellowstone-grpc";
import bs58 from 'bs58';
import dotenv from 'dotenv'

dotenv.config();


const client = new Client(process.env.ENDPOINT, undefined, undefined);



// const PUMPFUN_PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
const PUMPSWAP_PROGRAM_ID = "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"


// const CREATE_DISCRIMINATOR = Buffer.from([24, 30, 200, 40, 5, 28, 7, 119]);
const CREATE_POOL_DISCRIMINATOR = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);



async function main() {
    console.log("Starting Pump.fun token listener...");

    const strem = await client.subscribe();

    const request: SubscribeRequest = {
        accounts: {},
        slots: {},
        transactions: {
            pump: {
                // eg: listen to PumpFun transactions
                // accountInclude: [PUMPFUN_PROGRAM_ID],
                accountInclude: [PUMPSWAP_PROGRAM_ID],
                accountExclude: [],
                accountRequired: [],
            },
        },
        transactionsStatus: {},
        blocks: {},
        blocksMeta: {},
        entry: {},
        accountsDataSlice: [],
    }

    strem.write(request)

    console.log("Stream On Started");



    strem.on("data", async (data: SubscribeUpdate) => {

        const transaction = data.transaction?.transaction;
        const message = transaction?.transaction?.message!









        if (!transaction || !message) return;


        const createPoolInstruction = message.instructions.find(ix =>
            ix.data && CREATE_POOL_DISCRIMINATOR.equals(ix.data.slice(0, 8))
        )

        if (!createPoolInstruction) return;
        // console.log(message);


        
        const accountKeys = message.accountKeys;
        const accounts = createPoolInstruction.accounts!;
        console.log('ins is ----------------------', createPoolInstruction);

        // Typically, for a pool creation instruction, the base and quote token mints are among the first accounts.
        // Adjust indices if your instruction layout is different.
        const baseTokenAddress = new PublicKey(accountKeys[accounts[0]]).toBase58();
        const quoteTokenAddress = new PublicKey(accountKeys[accounts[1]]).toBase58();

        console.log('Base Token Address:', baseTokenAddress);
        console.log('Quote Token Address:', quoteTokenAddress);


        // const createInstruction = message.instructions.find(ix =>
        //     ix.data && CREATE_DISCRIMINATOR.equals(ix.data.slice(0, 8))
        // );

        // if (!createInstruction) return;


        //  const accountKeys = message.accountKeys 
        // const accounts= createInstruction.accounts!;

        // console.log('createInstruction found' , createInstruction);

        // const mint = new PublicKey(accountKeys[accounts[0]]).toBase58();
        // const bonding_curve = new PublicKey(accountKeys[accounts[2]]).toBase58();
        // const associated_bonding_curve = new PublicKey(accountKeys[accounts[3]]).toBase58();
        //  const user = new PublicKey(accountKeys[accounts[7]]).toBase58();


        //  console.log('mint is', mint);

        //  console.log('bc  is', bonding_curve);

        //  console.log('user is', user);

        //  console.log("---".repeat(20));








    })

}

main().catch(console.error);


function parseRaydiumPool() {

    //pa
}