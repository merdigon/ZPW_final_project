export class Order {
    _id: String;
    customerName: String;
    customerAddress: String;
    completed: Boolean;
    positions: [
        {
            id: String,
            shopItemId: String,
            shopItemName: String,
            quantity: Number
        }
    ];
}
