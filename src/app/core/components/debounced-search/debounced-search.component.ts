import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-debounced-search',
  templateUrl: './debounced-search.component.html',
  styleUrls: ['./debounced-search.component.scss'],
  imports:[ReactiveFormsModule,CommonModule]
})
export class DebouncedSearchComponent implements OnInit {
  @Input() placeholder: string = 'Search';
  @Input() debounceTime: number = 2000; // Default debounce time to 2 seconds
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  searchControl: FormControl = new FormControl('');
  search$ = new Observable<string>;

  ngOnInit(): void {
    this.search$ = this.searchControl.valueChanges.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      tap(value => this.search.emit(value))
    );
  }
}
