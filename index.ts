
import Client, { SubscribeRequest, SubscribeUpdate } from "@triton-one/yellowstone-grpc";
import bs58 from 'bs58';
import dotenv from 'dotenv'
import fetch from "node-fetch";

import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";

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

        if (!createPoolInstruction) return null;
        // console.log(message);



        const accountKeys = message.accountKeys;
        const accounts = createPoolInstruction.accounts!;

        let pairIndex;

        const findpair = accountKeys.map((account, index) => {

            if (bs58.encode(account) === 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA') {
                pairIndex = index + 1
            } else {
                return;
            }
        });

        if(!findpair) return;

        const pairAccount = bs58.encode(accountKeys[pairIndex])


        console.log('hello');

        const url = `https://api-v2.solscan.io/v2/account?address=${pairAccount}`;
        console.log("Fetching:", url);

        const response = await axios.get(url, {
            headers: {
                accept: "application/json",
                origin: "https://solscan.io",
                referer: "https://solscan.io/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
        });

  

        const body = await response.data;
        // console.log(body);
        console.log(pairAccount);

        console.log(body.data.notifications)
        console.log(body.data.parseData);









    })

}

main().catch(console.error);


function parseRaydiumPool() {

    //pa
}