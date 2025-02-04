import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FileDetails } from "./file-explorer/file-explorer.model";


@Injectable({providedIn: 'root'})
export class FileTransferService {
    private selectedFileSubject = new BehaviorSubject<FileDetails | null>(null);
    public selectedFile$ = this.selectedFileSubject.asObservable();

    public setSelectedFile(file: FileDetails){
        this.selectedFileSubject.next(file)
    }
}