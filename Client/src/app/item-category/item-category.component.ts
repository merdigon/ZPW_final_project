import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemCategory } from '../item-category';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css']
})
export class ItemCategoryComponent implements OnInit {

  @Input() itemCategory: ItemCategory;
  @Output() notifyStateChange = new EventEmitter();

  categoryChoosen = true;

  constructor() { }

  ngOnInit() {
  }

  changeButtonState() {
    this.categoryChoosen = !this.categoryChoosen;
    this.notifyStateChange.emit({ name: this.itemCategory.name, state: this.categoryChoosen });
  }
}
