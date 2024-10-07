import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SectorSignalStoreService {
  private readonly LOCAL_STORAGE_KEY = 'sectorId';

  // Signal to store sectorId, initializing from localStorage if available
  private _sectorId = signal<number | null>(this.loadFromLocalStorage());

  // Getter for sectorId signal
  get sectorId() {
    return this._sectorId();
  }

  // Method to set the sectorId
  setSectorId(sectorId: number) {
    this._sectorId.set(sectorId);
    this.saveToLocalStorage(sectorId); // Save to localStorage
  }

  // Method to clear the sectorId
  clearSectorId() {
    this._sectorId.set(null);
    localStorage.removeItem(this.LOCAL_STORAGE_KEY); // Remove from localStorage
  }

  // Load sectorId from localStorage
  private loadFromLocalStorage(): number | null {
    const storedId = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return storedId ? +storedId : null; // Return parsed value or null if not found
  }

  // Save sectorId to localStorage
  private saveToLocalStorage(sectorId: number) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, sectorId.toString());
  }
}
