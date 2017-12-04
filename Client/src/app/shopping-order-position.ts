import { ShopItem } from './shop-item';

export class ShoppingOrderPosition {
    item: ShopItem;
    quantity: number;
    price: number;

    constructor(_item: ShopItem, _quantity: number, _price: number) {
        this.item = _item;
        this.quantity = _quantity;
        this.price = _price;
    }
}
