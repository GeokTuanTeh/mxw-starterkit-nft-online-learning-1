'use strict';

import { mxw } from './index';

export class Student {

    private providerConn: mxw.providers.Provider;
    
    constructor(providerConn: mxw.providers.Provider) {
        this.providerConn = providerConn;
    }

    registerNewStudent() {
        //create wallet instance
        let student: mxw.Wallet = mxw.Wallet.createRandom();

        console.log("Wallet address:", student.address);
        console.log("Wallet mnemonic:", student.mnemonic);

        //connect to provider
        student.connect(this.providerConn);
        student.getKycAddress();
    }

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