'use strict';

import { mxw } from './index';
import { BigNumber } from "mxw-sdk-js/dist/utils";
import { nodeProvider } from './env';

export class Student {

    private providerConn: mxw.providers.Provider;

    constructor(providerConn: mxw.providers.Provider) {
        this.providerConn = providerConn;
    }

    /**
     * Register new student
     */
    registerNewStudent() {
        // create wallet instance
        let student: mxw.Wallet = mxw.Wallet.createRandom();

        console.log("Wallet address:", student.address);
        // sample output: mxw18mt86al0xpgh2qhvyeqgf8m96xpwz55sdfwc8n
        console.log("Wallet mnemonic:", student.mnemonic);
        // sample output: unaware timber engage dust away host narrow market hurry wave inherit bracket

        this.getStudentInfo(student.mnemonic);
    }

    /**
     * Query wallet from mnemonic or private key.
     * @param mnemonic string
     */
    getStudent(theId: { [name: string]: string }): mxw.Wallet {
        //mnemonic: string, privateKey: string
        let student: mxw.Wallet;

        if (theId["mnemonic"] && theId["mnemonic"].length > 0 && theId["mnemonic"].indexOf(" ") > 0) {
            try {
                student = mxw.Wallet.fromMnemonic(theId["mnemonic"]);
            } catch (error) {
                console.log(error);
            }
        }
        if (student == undefined && theId["privateKey"] && theId["privateKey"].length > 0 && theId["privateKey"].startsWith("0x")) {
            student = new mxw.Wallet(theId["privateKey"]);
        }

        if (student) {
            student = student.connect(this.providerConn);
        }

        return student;
    }

    /**
     * Get student/wallet info via mnemonic or private key. 
     * @param theId string - mnemonic or private key
     */
    getStudentInfo(theId: string) {
        const ids = {
            mnemonic: theId,
            privateKey: theId
        };
        //mnemonic: string, address: string, privateKey: string
        let student: mxw.Wallet = this.getStudent(ids);

        if (student == undefined) {
            return this.providerConn.getAccountState(theId).then((accState) => {
                console.log("Account state:", JSON.stringify(accState));
            });
        } else {
            console.log("Wallet address:", student.address);
            console.log("Wallet private key:", student.privateKey);

            return student.getAccountNumber()
                .then((accountNumber) => {
                    console.log("Wallet account number: " + accountNumber.toString());
                }).then(() => {
                    return student.getBalance()
                        .then((balance) => {
                            console.log("Wallet balance: " + balance.toString());
                        });
                }).then(() => {
                    return student.isWhitelisted().then((result) => {
                        console.log("Is wallet whitelisted: " + result.toString());
                    });
                });
        }
    }

    /**
     * Make payment, i.e. transfer MXW
     * @param studentId string of mnemonic or private key, for use to retrieve wallet.
     * @param amount BigNumber 
     */
    makePayment(studentId: string, amount: BigNumber) {
        let student = this.getStudent({ mnemonic: studentId, privateKey: studentId });
        
        if (student) {
            return student.transfer(nodeProvider.nonFungibleToken.feeCollector, amount)
                .then((receipt) => {
                    console.log("Receipt", JSON.stringify(receipt));
                    return Promise.resolve();
                }).catch(error => {
                    console.log(error);
                });
        } else {
            console.log("Unable to verify student identity");
            return Promise.resolve();
        }
    }

}