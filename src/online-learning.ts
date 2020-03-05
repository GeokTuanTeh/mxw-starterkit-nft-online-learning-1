'use strict';

import { Course } from "./course-service";
import { mxw } from './index';
import { nodeProvider } from "./env";
import { Student } from "./student-service";
import { BigNumber } from "mxw-sdk-js/dist/utils";
import { bigNumberify } from 'mxw-sdk-js/dist/utils';

let providerConn: mxw.providers.Provider;

export class OnlineLearning {

    private student: Student;
    private course: Course;

    constructor() {
        providerConn = new mxw.providers.JsonRpcProvider(nodeProvider.connection, nodeProvider);

        this.student = new Student(providerConn);
        this.course = new Course(providerConn);
    }

    // Create Wallet
    registerNewStudent() {
        this.student.registerNewStudent();
    }

    // Create NFT 
    addCourse(courseName: string) {
        this.course.createNewCourse(courseName);
    }

    // Approve NFT
    approveCourse(courseSymbol: string, seatLimit: number) {
        this.course.approveCourse(courseSymbol, seatLimit);
    }

    // Mint and transfer NFT item
    enrolStudentToCourse(studentId: string, courseSymbol: string, enrolCount: number) {
        let student: mxw.Wallet = this.student.getStudent({mnemonic: studentId, privateKey: studentId});

        if (student) {
            this.course.enrolStudentToCourse(student, courseSymbol, enrolCount);
        }        
    }

    // Mint NFT item in bulk
    bulkMintItem() {
        this.course.bulkMintItem();
    }

    // Get Wallet info via mnemonic, wallet address or private key
    getStudentInfo(theId: string) {
        this.student.getStudentInfo(theId);
    }

    // Get NFT info
    getCourseInfo(courseName: string) {
        this.course.getCourseInfo(courseName);
    }

    // Make payment
    studentMakePayment(wallet: string, amount: BigNumber) {
        this.student.makePayment(wallet, amount);
    }

    main() {
        console.log("Action:", process.argv[2]);

        for (let i = 3; ; i++) {
            if (process.argv[i] == undefined) {
                break;
            }
            console.log(">> Param#", (i - 2), ":", process.argv[i]);
        }

        try {
            switch (process.argv[2]) {
                case "registerNewStudent":
                    this.registerNewStudent();
                    break;
                case "addCourse":
                    this.addCourse(process.argv[3]);
                    break;
                case "getCourseInfo":
                    this.getCourseInfo(process.argv[3]);
                    break;
                case "approveCourse":
                    this.approveCourse(process.argv[3], parseInt(process.argv[4]));
                    break;
                case "studentMakePayment":
                    this.studentMakePayment(process.argv[3], bigNumberify(process.argv[4]));
                    break;
                case "enrolStudentToCourse":
                    this.enrolStudentToCourse(process.argv[3], process.argv[4], parseInt(process.argv[5]));
                    break;
                case "getStudentInfo":
                    this.getStudentInfo(process.argv[3]);
                    break;
                default:
                    console.log("Please enter module name, followed by its parameter(s), if applicable.");
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (providerConn) {
                providerConn.removeAllListeners();
            }            
        }
    }
}

new OnlineLearning().main();
