'use strict';

interface Node {

    connection: {
        url: string,
        timeout: number
    },
    trace: {
        silent: boolean,
        silentRpc: boolean
    },
    chainId: string,
    name: string,
    airDrop: string,
    kyc: {
        provider: string,
        issuer: string,
        middleware: string
    },
    alias: {
        provider: string,
        issuer: string,
        middleware: string,
        feeCollector: string
    },

    fungibleToken: {
        provider: string,
        issuer: string,
        middleware: string,
        feeCollector: string,
    },

    nonFungibleToken: {
        provider: string,
        issuer: string,
        middleware: string,
        feeCollector: string,
        itemReceiver: string
    },
};

const testnet: Node = {
    connection: {
        url: "https://alloys-rpc.maxonrow.com",
        timeout: 60000
    },

    trace: {
        silent: true,
        silentRpc: true
    },

    chainId: "alloys",
    name: "alloys",
    airDrop: "roof voyage expire ball image despair soldier token destroy rocket couch drink",
    
    kyc: {
        provider: "into demand chief rubber raw hospital unit tennis sentence fade flight cluster",
        issuer: "pill maple dutch predict bulk goddess nice left paper heart loan fresh",
        middleware: "avocado trade bright wolf marble penalty mimic curve funny name certain visa"
    },

    alias: {
        provider: "",
        issuer: "",
        middleware: "",
        feeCollector: ""
    },

    fungibleToken: {
        provider: "mother paddle fire dolphin nuclear giggle fatal crop cupboard close abandon truck",
        issuer: "dynamic car culture shell kiwi harsh tilt boost vote reopen arrow moon",
        middleware: "hospital item sad baby mass turn ability exhibit obtain include trip please",
        feeCollector: "mxw1qgwzdxf66tp5mjpkpfe593nvsst7qzfxzqq73d"
    },

    nonFungibleToken: {
        provider: "mother paddle fire dolphin nuclear giggle fatal crop cupboard close abandon truck",
        issuer: "dynamic car culture shell kiwi harsh tilt boost vote reopen arrow moon",
        middleware: "hospital item sad baby mass turn ability exhibit obtain include trip please",
        feeCollector: "mxw1qgwzdxf66tp5mjpkpfe593nvsst7qzfxzqq73d",
        itemReceiver: ""
    }

};

const nodes: { [name: string]: Node } = { testnet };
const nodeProvider: Node = testnet;

export {
    nodeProvider, nodes, testnet,
    Node
};

