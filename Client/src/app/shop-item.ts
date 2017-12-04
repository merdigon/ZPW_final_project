import { ItemCategory } from './item-category';

export class ShopItem {
    _id: string;
    name: string;
    imageSrc: string;
    description: string;
    price: number;
    categories: string[];
    sale: number;

    constructor(_name: string, _imageSrc: string, _description: string, _price: number, _categories: string[]) {
        this.name = _name;
        this.imageSrc = _imageSrc;
        this.description = _description;
        this.price = _price;
        this.categories = _categories;
    }
}
