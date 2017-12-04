import { Pipe, PipeTransform } from '@angular/core';
import { ItemCategory } from './item-category';
import { ShopItem } from './shop-item';

@Pipe({
  name: 'categoryFilter',
  pure: false
})
export class CategoryFilterPipe implements PipeTransform {

  transform(value: ShopItem[], categories: ItemCategory[]): ShopItem[] {
    if (typeof value === 'undefined' || !value) {
      return [];
    }

    if (typeof categories === 'undefined' || !categories) {
      return value;
    }
    
    return value.filter(elem =>
      elem.categories.some(i =>
        categories.some(j => j.name === i)
      )
    );
  }
}
