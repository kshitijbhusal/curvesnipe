import { PublicKey } from "@solana/web3.js";
import Client, { SubscribeRequest, SubscribeUpdate } from "@triton-one/yellowstone-grpc";
import bs58 from 'bs58';
import dotenv from 'dotenv'

dotenv.config();


const client = new Client(process.env.ENDPOINT, undefined, undefined);



const PUMPFUN_PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"


const CREATE_DISCRIMINATOR = Buffer.from([24, 30, 200, 40, 5, 28, 7, 119]);



async function main() {
    console.log("Starting Pump.fun token listener...");

    const strem = await client.subscribe();

    const request: SubscribeRequest = {
        accounts: {},
        slots: {},
        transactions: {
            pump: {
                // eg: listen to PumpFun transactions
                accountInclude: [PUMPFUN_PROGRAM_ID],
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

        const createInstruction = message.instructions.find(ix =>
            ix.data && CREATE_DISCRIMINATOR.equals(ix.data.slice(0, 8))
        );

        if (!createInstruction) return;


         const accountKeys = message.accountKeys 
        const accounts= createInstruction.accounts!;

        console.log('createInstruction found' , createInstruction);

        const mint = new PublicKey(accountKeys[accounts[0]]).toBase58();
        const bonding_curve = new PublicKey(accountKeys[accounts[2]]).toBase58();
        const associated_bonding_curve = new PublicKey(accountKeys[accounts[3]]).toBase58();
         const user = new PublicKey(accountKeys[accounts[7]]).toBase58();


         console.log('mint is', mint);

         console.log('bc  is', bonding_curve);

         console.log('user is', user);
         
         console.log("---".repeat(20));
        
        






    })

}

main().catch(console.error);


function parseRaydiumPool () {
    
    //pa
}