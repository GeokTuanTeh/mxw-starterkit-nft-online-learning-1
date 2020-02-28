'use strict';

import { mxw, nonFungibleToken as token } from './index';
import { bigNumberify } from 'mxw-sdk-js/dist/utils';
import { nodeProvider } from "./env";
import { NonFungibleToken, NonFungibleTokenActions } from 'mxw-sdk-js/dist/non-fungible-token';
import { NonFungibleTokenItem } from 'mxw-sdk-js/dist/non-fungible-token-item';
//import * as crypto from "crypto";

//let wallet: mxw.Wallet;
let provider: mxw.Wallet;
let issuer: mxw.Wallet;
let middleware: mxw.Wallet;

let nonFungibleTokenProperties: token.NonFungibleTokenProperties;

let defaultOverrides = {
    logSignaturePayload: function (payload) {
        console.log("signaturePayload:", JSON.stringify(payload));
    },
    logSignedTransaction: function (signedTransaction) {
        console.log("signedTransaction:", signedTransaction);
    }
}

export class Course {

    private providerConn: mxw.providers.Provider;

    constructor(providerConn: mxw.providers.Provider) {
        this.providerConn = providerConn;

        //wallet = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer).connect(providerConn);
        provider = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.provider).connect(providerConn);
        issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(this.providerConn);
        middleware = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.middleware).connect(providerConn);
    }

    createNewCourse(courseName: string) {

        nonFungibleTokenProperties = {
            name: courseName,
            symbol: courseName,
            fee: {
                to: nodeProvider.nonFungibleToken.feeCollector,
                value: bigNumberify("1")
            },
            metadata: "Course " + courseName,
            properties: courseName
        };

        //create NFT using above properties
        return token.NonFungibleToken.create(nonFungibleTokenProperties, issuer, defaultOverrides).then((token) => {
            console.log("Symbol:", nonFungibleTokenProperties.symbol);
        });
    }

    approveCourse(courseSymbol: string, seatLimit: number) {
        let nftState = {
            tokenFees: [
                { action: NonFungibleTokenActions.transfer, feeName: "default" },
                { action: NonFungibleTokenActions.transferOwnership, feeName: "default" },
                { action: NonFungibleTokenActions.acceptOwnership, feeName: "default" }
            ],
            endorserList: [],
            mintLimit: seatLimit,
            transferLimit: 1,
            burnable: true,
            transferable: true,
            modifiable: true,
            pub: false   // not public
        };

        //provider approve NFT, at same time, set NFT with above state
        return token.NonFungibleToken.approveNonFungibleToken(courseSymbol, provider, nftState)
            .then((transaction) => {
                //issuer sign NFT
                return token.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer);
            }).then((transaction) => {
                //middleware send NFT
                return token.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware)
                    .then((receipt) => {
                        console.log(receipt);
                        return receipt;
                    });
            });
    }

    enrolStudentOnCourse(courseSymbol: string, theId: number, student: mxw.Wallet, ) {
        var minter = new NonFungibleToken(courseSymbol, issuer);

        //get mint limit from NFT state
        return minter.getState().then((result) => {
            let mintLimit: number = result.mintLimit.toNumber();
            console.log("Mint Limit:", mintLimit);

            let itemId = courseSymbol + '#' + theId;
            let properties = "Course " + courseSymbol + " - Seat #" + theId;
            let itemProp = {
                symbol: courseSymbol,
                itemID: itemId,
                properties: properties,
                metadata: properties
            } as token.NonFungibleTokenItem;

            console.log("Minting item:", itemId);
            let nftItem: NonFungibleTokenItem;

            //mint item
            return minter.mint(issuer.address, itemProp).then((receipt) => {
                console.log("Mint Receipt:", JSON.stringify(receipt));

                //query item
                return NonFungibleTokenItem.fromSymbol(courseSymbol, itemId, issuer).then((theItem) => {
                    nftItem = theItem;

                    //print its state
                    return nftItem.getState().then((itemState) => {
                        console.log("Item state:", JSON.stringify(itemState));
                        console.log("Transferring NFT item to:" + student.address);

                        //transfer item to wallet, with some memo
                        let overrides = { memo: itemId + " transferred to " + student.address };
                        return nftItem.transfer(student.address, overrides).then((receipt) => {
                            console.log("Transfer NFT item receipt:", JSON.stringify(receipt));
                        });

                    });
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });
        });
    }

    getCourse(courseSymbol: string, id:number) {
        //Account6#5
        let itemId = courseSymbol + "#" + id;
        return NonFungibleTokenItem.fromSymbol(courseSymbol, itemId, issuer).then((theItem) => {
            return theItem.getState().then((itemState) => {
                console.log(itemState);

            });
        });
    }

}