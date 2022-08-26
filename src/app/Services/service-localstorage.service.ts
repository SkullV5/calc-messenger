import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceLocalstorageService {
  private _storage: Storage | null = null;
  private subjects: Map<string, BehaviorSubject<any>>;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    this.subjects = new Map<string, BehaviorSubject<any>>();
  }

  // Create and expose methods that users of this service can
  // call, for example:
  async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  async get(key: string) {
    return await this._storage?.get(key);
  }
  
  watch(key: string): Observable<any> {
    if (!this.subjects.has(key)) {
        this.subjects.set(key, new BehaviorSubject<any>(null));
    }
    var item;
    this._storage.get(key).then((val) => {
      item = val;
    });
    if (item === "undefined") {
        item = undefined;
    } else {
        item = JSON.parse(item);
    }
    this.subjects.get(key).next(item);
    return this.subjects.get(key).asObservable();
  }

  public remove(key: string){
    this._storage?.remove(key);
  }

  public removeall(){
    this._storage?.clear();
  }
  async getKeys() {
    return await this._storage?.keys();
  }
}
