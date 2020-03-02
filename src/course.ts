'use strict';

import { mxw, nonFungibleToken as token } from './index';
import { bigNumberify } from 'mxw-sdk-js/dist/utils';
import { nodeProvider } from "./env";
import { NonFungibleToken, NonFungibleTokenActions } from 'mxw-sdk-js/dist/non-fungible-token';
import { NonFungibleTokenItem } from 'mxw-sdk-js/dist/non-fungible-token-item';

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

        provider = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.provider).connect(providerConn);
        issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(this.providerConn);
        middleware = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.middleware).connect(providerConn);
    }

    /**
     * Create new NFT 
     * @param courseName string
     */
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

        // create NFT using above properties
        return token.NonFungibleToken.create(nonFungibleTokenProperties, issuer, defaultOverrides).then((token) => {
            console.log("Symbol:", nonFungibleTokenProperties.symbol);
        });
    }

    /**
     * Approve course
     * @param courseSymbol string
     * @param seatLimit number
     */
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

        // provider approves NFT, at same time, set NFT with above state
        return token.NonFungibleToken.approveNonFungibleToken(courseSymbol, provider, nftState)
            .then((transaction) => {
                // issuer signs NFT status transaction
                return token.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer);
            }).then((transaction) => {
                // middleware sends NFT NFT status transaction
                return token.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware)
                    .then((receipt) => {
                        console.log(receipt);
                        return receipt;
                    });
            });
    }

    /**
     * Query course entry pass
     * @param courseSymbol string
     * @param id number
     */
    getCourseEntryPass(courseSymbol: string, id: number) {
        let itemId = courseSymbol + "#" + id;
        return NonFungibleTokenItem.fromSymbol(courseSymbol, itemId, issuer).then((theItem) => {
            return theItem.getState().then((itemState) => {
                console.log(itemState);
            });
        });
    }
    
    /**
     * Enrol student to a course
     * @param student mxw.Wallet
     * @param courseSymbol string
     * @param theId number
     */
    enrolStudentToCourse(student: mxw.Wallet, courseSymbol: string, theId: number) {
        return this.mintItem(courseSymbol, theId) // mint course entry pass
            .then((nftItem) => {
                let itemId = courseSymbol + "#" + theId;
                return this.transferItem(nftItem, itemId, student); // tranfer pass to student
            })
            .catch(error => { // handle error, if any
                console.log("enrolStudentToCourse", error);
                throw error;
            });
    }

    /**
     * Mint NFT item
     * @param courseSymbol string
     * @param theId number
     */
    mintItem(courseSymbol: string, theId: number) {
        var minter = new NonFungibleToken(courseSymbol, issuer); // query NFT created before
        let itemId = courseSymbol + '#' + theId;
        let properties = "Course " + courseSymbol + " - Seat #" + theId;
        let itemProp = {
            symbol: courseSymbol, // value must be same with NFT symbol, the parent
            itemID: itemId, // value must be unique for same NFT
            properties: properties,
            metadata: properties
        } as token.NonFungibleTokenItem;

        // mint item to issuer wallet, with item properties defined above
        return minter.mint(issuer.address, itemProp)
            .then((receipt) => {
                console.log("Mint item receipt:", receipt);
                return NonFungibleTokenItem.fromSymbol(courseSymbol, itemId, issuer);
            }).then((nftItem) => {
                return this.getNftItemState(nftItem); // print out the NFT item state
            })
            .catch(error => { // handle error, if any
                console.log("mintItem", error);
                throw error;
            });
    }

    /**
     * Transfer NonFungibleTokenItem to a Wallet
     * @param nftItem NonFungibleTokenItem
     * @param itemId string
     * @param student mxw.Wallet 
     */
    transferItem(nftItem: NonFungibleTokenItem, itemId: string, student: mxw.Wallet) {
        let overrides = { memo: itemId + " transferred to " + student.address }; // optional

        // transfer NFT item to student
        return nftItem.transfer(student.address, overrides)
            .then((receipt) => {
                console.log("Transfer NFT item receipt:", JSON.stringify(receipt));
                return nftItem;
            }).then((nftItem) => {
                return this.getNftItemState(nftItem); // print out the NFT item state
            })
            .catch(error => { // handle error, if any
                console.log("transferItem", error);
                throw error;
            });
    }

    /**
     * Query and print NFT item state
     * @param nftItem NonFungibleTokenItem
     */
    getNftItemState(nftItem: NonFungibleTokenItem) {
        return nftItem.getState() // query NFT item state
            .then((itemState) => {
                console.log("Item state:", JSON.stringify(itemState)); // print NFT item state
                return nftItem;
            })
            .catch(error => { // handle error, if any
                console.log("getNftItemState", error);
                throw error;
            });
    }

}

