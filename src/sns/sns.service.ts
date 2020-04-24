import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";

@Injectable()
export class SNSService {
    entryCodesPDFExportDoneNewURLAvailableObservable: Subject<PDFExportDoneInfo>;

    constructor() {
        this.entryCodesPDFExportDoneNewURLAvailableObservable = new Subject();
    }

    /**
     * 
     * @param message The actual message
     * @param isJSON Whether the message should be parsed into JSON
     */
    async onNewMessageFromPDFExportTopic(message: string, isJSON: boolean = true) {
        this.entryCodesPDFExportDoneNewURLAvailableObservable.next(JSON.parse(message));
    }

    async subscribeToPDFExportTopic(callback: (arg0: PDFExportDoneInfo) => void) {
        this.entryCodesPDFExportDoneNewURLAvailableObservable.subscribe(callback);
    }
}

export interface PDFExportDoneInfo {
    id: string;
    url: string;
}