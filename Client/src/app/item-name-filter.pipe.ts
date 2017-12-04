import { Pipe, PipeTransform } from '@angular/core';
import { ShopItem } from './shop-item';

@Pipe({
  name: 'itemNameFilter',
  pure: false
})
export class ItemNameFilterPipe implements PipeTransform {

  transform(value: ShopItem[], nameFilter: string): ShopItem[] {
    if (typeof value === 'undefined') {
      return [];
    }

    if (typeof nameFilter === 'undefined' || nameFilter) {
      return value;
    }

    console.log('Niepuste ' + nameFilter.length);
    return value.filter(elem => elem.name.indexOf(nameFilter) !== -1);
  }
}
