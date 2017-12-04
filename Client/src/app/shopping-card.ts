import { ShoppingOrderPosition } from './shopping-order-position';
import { ShopItem } from './shop-item';

export class ShoppingCard {
    cardPositions: ShoppingOrderPosition[];

    constructor() {
        this.cardPositions = new Array<ShoppingOrderPosition>();
    }

    addItem(item: ShopItem, quantity: number) {
        let wasAdded = false;

        this.cardPositions.forEach(elem => {
            if (elem.item._id === item._id) {
                elem.quantity += quantity;

                if (typeof elem.item.sale !== 'undefined') {
                    elem.price = (elem.item.price * ((100 - elem.item.sale) / 100));
                }
                wasAdded = true;
            }
        });

        if (!wasAdded) {
            if (typeof item.sale !== 'undefined') {
                this.cardPositions.push(new ShoppingOrderPosition(item, quantity, (item.price * ((100 - item.sale) / 100))));
            } else {
                this.cardPositions.push(new ShoppingOrderPosition(item, quantity, item.price));
            }
        }
    }

    removeItem(item: ShopItem, quantity: number) {
        let itemToRemove = -1;

        this.cardPositions.forEach((elem, index) => {
            if (elem.item._id === item._id) {
                elem.quantity -= quantity;

                if (elem.quantity <= 0) {
                    itemToRemove = index;
                }
            }
        });

        if (itemToRemove !== -1) {
            this.cardPositions.splice(itemToRemove, 1);
        }
    }

    removeItemCompletly(item: ShopItem): number {
        let quantity = 0;

        this.cardPositions.forEach((elem, index) => {
            if (elem.item._id === item._id) {
                quantity += elem.quantity;
            }
        });

        this.removeItem(item, quantity);
        return quantity;
    }

    getTotalValue(): number {
        let totalValue = 0;

        this.cardPositions.forEach(elem => {
            totalValue += elem.quantity * elem.price;
        });

        return totalValue;
    }
}
