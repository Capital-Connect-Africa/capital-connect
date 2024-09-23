import { Injectable } from "@angular/core";

const getWindow =() =>{
    return typeof window !== 'undefined' ? window : null;
}

@Injectable({providedIn: 'root'})
export class WindowReferenceService{
    get nativeWindow(): any{
        return getWindow()
    }
}