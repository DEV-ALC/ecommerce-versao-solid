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

interface ProductDetail {
  id: number;
  name: string;
  type: "physical" | "digital";
  price: number;
  quantity: number;
}

interface Item {
  productId: number;
  quantity: number;
}

interface OutputProcessOrder {
  message: string;
  orderId: number;
  emailPreview: string | false;
}
