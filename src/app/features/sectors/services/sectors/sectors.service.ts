import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BASE_URL, BaseHttpService } from '../../../../core';
import { Sector, SectorInput, SubSector, SubSectorInput, Segment } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SectorsService extends BaseHttpService {

  constructor(private _httpClient: HttpClient) {
    super(_httpClient)
  }

  //sectors
  createSector(sector: SectorInput) {
    return this.create(`${BASE_URL}/sectors`, sector) as Observable<Sector>
  }

  updateSector(sector: Sector) {
    return this.update(`${BASE_URL}/sectors`, sector.id, sector) as Observable<Sector>
  }

  getAllSectors() {
    return this.read(`${BASE_URL}/sectors?page=1&limit=50`) as Observable<Sector[]>
  }

  getSingleSector(id: number) {
    return this.readById(`${BASE_URL}/sectors`, id) as Observable<Sector>
  }

  //Subsector
  createSubSector(subsection: SubSectorInput) {
    return this.create(`${BASE_URL}/subsectors`, subsection) as Observable<SubSector>
  }

  updateSubSector(subsection: SubSector) {
    return this.update(`${BASE_URL}/subsectors`, subsection.id, subsection) as Observable<SubSector>
  }

  getSingleSubsector(id: number) {
    return this.readById(`${BASE_URL}/subsectors`, id) as Observable<SubSector>
  }

  getSubSectorOfaSector(sectorId: number) {
    return this.read(`${BASE_URL}/sectors/${sectorId}/subsectors`) as Observable<SubSector[]>
  }

  removeSector(sectorId: number) {
    return this.delete(`${BASE_URL}/sectors`, sectorId).pipe(map(res => true));
  }
  removeSubSector(subSectorId: number) {
    return this.delete(`${BASE_URL}/subsectors`, subSectorId).pipe(map(res => true));
  }



  // Segments
  getSegmentsOfaSubSector(subSectorId: number) {
    return this.read(`${BASE_URL}/segments/sub-sectors/${subSectorId}`) as Observable<Segment[]>
  }

  //Create a segment
  createSegment(segment: Segment) {
    return this.create(`${BASE_URL}/segments`, segment) as Observable<unknown>
  }

  deleteSegment(segmentId:number){
    return this.delete(`${BASE_URL}/segments`,segmentId) as Observable<unknown>
  }

  getSegment(id:number): Observable<Segment>{
    return this.readById(`${BASE_URL}/segments`, id) as Observable<Segment>
  }

  updateSegment(segmentId:number, body:Segment){
    return this.update(`${BASE_URL}/segments`,segmentId,body) as Observable<unknown>

  }

}
