interface NgExpressEngine {
  response: {
    status: (code: number) => void;
  };
}

interface  Window {
  ngExpressEngine?: NgExpressEngine;
}
