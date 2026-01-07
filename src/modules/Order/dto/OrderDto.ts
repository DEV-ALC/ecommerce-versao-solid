interface OrderDto {
  customer: string;
  items: string;
  total: number;
  status: string;
}

interface InputProcessOrder {
  customer: string;
  items: Item[];
  paymentMethod: any;
  paymentDetails: any;
}

interface Item {
  productId: number;
  quantity: number;
}

interface OutputProcessOrder {
  message: string;
  orderId: string;
  emailPreview: string | false;
}
