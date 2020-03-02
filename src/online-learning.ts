'use strict';

import { Course } from "./course";
import { mxw } from './index';
import { nodeProvider } from "./env";
import { Student } from "./student";

let providerConn: mxw.providers.Provider;

export class OnlineLearning {

    private student: Student;
    private course: Course;

    constructor() {
        providerConn = new mxw.providers.JsonRpcProvider(nodeProvider.connection, nodeProvider);

        this.student = new Student(providerConn);
        this.course = new Course(providerConn);
    }

    //Create Wallet
    registerNewStudent() {
        this.student.registerNewStudent();
    }

    //Create NFT for course
    addCourse(courseName: string) {
        this.course.createNewCourse(courseName);
    }

    approveCourse(courseSymbol: string, seatLimit: number) {
        this.course.approveCourse(courseSymbol, seatLimit);
    }

    enrolStudentToCourse(studentMnemonic: string, courseSymbol: string, enrolCount: number) {
        let student: mxw.Wallet = this.student.getStudent(studentMnemonic);
        this.course.enrolStudentToCourse(student, courseSymbol, enrolCount);
    }

    bulkMintItem() {
        this.course.bulkMintItem();
    }

    main() {
        try {
            switch (process.argv[2]) {
                case "registerNewStudent":
                    this.registerNewStudent();
                    break;
                case "addCourse":
                    this.addCourse(process.argv[3]);
                    break;
                case "approveCourse":
                    this.approveCourse(process.argv[3], parseInt(process.argv[4]));
                    break;
                case "enrolStudentToCourse":
                    this.enrolStudentToCourse(process.argv[3], process.argv[4], parseInt(process.argv[5]));
                    break;
                default:
                    console.log("Please enter module name, followed by its parameter(s), if any.");
            }
        } catch(error) {
            console.log(error);
        } finally {
            providerConn.removeAllListeners();
        }
        
    }
}

new OnlineLearning().main();
