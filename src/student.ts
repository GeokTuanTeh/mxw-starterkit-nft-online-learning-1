'use strict';

import { mxw } from './index';

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

        // connect to provider
        student.connect(this.providerConn);
    }

    /**
     * QUery wallet from mnemonic
     * @param mnemonic string
     */
    getStudent(mnemonic: string): mxw.Wallet {
        let wallet: mxw.Wallet = mxw.Wallet.fromMnemonic(mnemonic);

        if (wallet) {
            wallet.connect(this.providerConn);
            return wallet;
        } else {
            throw Error("Student not found");
        }
    }
}