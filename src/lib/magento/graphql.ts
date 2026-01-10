// Magento GraphQL Client
const GRAPHQL_ENDPOINT = `${process.env.MAGENTO_BASE_URL || 'https://tourwithalpha.shop'}/graphql`;

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

// Product Types
export interface ProductImage {
  url: string;
}

export interface PriceRange {
  maximum_price: {
    final_price: {
      value: number;
      currency: string;
    };
  };
}

export interface Product {
  sku: string;
  name: string;
  quantity: number;
  image: ProductImage;
  short_description: {
    html: string;
  };
  stock_status: string;
  special_price: number | null;
  price_range: PriceRange;
}

export interface ProductsResponse {
  products: {
    items: Product[];
  };
}

// Cart Types
export interface CartPrices {
  grand_total: {
    value: number;
    currency: string;
  };
}

export interface Cart {
  id?: string;
  prices: CartPrices;
}

export interface CreateCartResponse {
  createEmptyCart: string;
}

export interface AddToCartResponse {
  addVirtualProductsToCart: {
    cart: Cart;
  };
}

// Fetch product by URL key
export async function getProductByUrlKey(urlKey: string): Promise<Product | null> {
  const query = `
    query GetProduct($urlKey: String!) {
      products(filter: { url_key: { eq: $urlKey } }) {
        items {
          sku
          name
          quantity
          image {
            url
          }
          short_description {
            html
          }
          stock_status
          special_price
          price_range {
            maximum_price {
              final_price {
                value
                currency
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<ProductsResponse>(query, { urlKey });
    return data.products.items[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Fetch multiple products by URL keys
export async function getProductsByUrlKeys(urlKeys: string[]): Promise<Product[]> {
  const products: Product[] = [];
  for (const urlKey of urlKeys) {
    const product = await getProductByUrlKey(urlKey);
    if (product) {
      products.push(product);
    }
  }
  return products;
}

// Create empty cart
export async function createEmptyCart(): Promise<string | null> {
  const query = `
    mutation {
      createEmptyCart
    }
  `;

  try {
    const data = await graphqlFetch<CreateCartResponse>(query);
    return data.createEmptyCart;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

// Add virtual product to cart
export async function addToCart(
  cartId: string,
  sku: string,
  quantity: number
): Promise<Cart | null> {
  const query = `
    mutation AddToCart($cartId: String!, $sku: String!, $quantity: Float!) {
      addVirtualProductsToCart(
        input: {
          cart_id: $cartId
          cart_items: [
            {
              data: {
                quantity: $quantity
                sku: $sku
              }
            }
          ]
        }
      ) {
        cart {
          prices {
            grand_total {
              value
              currency
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<AddToCartResponse>(query, {
      cartId,
      sku,
      quantity,
    });
    return data.addVirtualProductsToCart.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

// Get or create cart ID from localStorage
export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('magento_cart_id');
}

export function setCartId(cartId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('magento_cart_id', cartId);
}

export function clearCartId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('magento_cart_id');
}

// Clear cart mutation
export interface ClearCartResponse {
  clearCart: {
    cart: {
      id: string;
    };
  };
}

export async function clearCart(cartUid: string): Promise<boolean> {
  const query = `
    mutation ClearCart($uid: String!) {
      clearCart(input: { uid: $uid }) {
        cart {
          id
        }
      }
    }
  `;

  try {
    await graphqlFetch<ClearCartResponse>(query, { uid: cartUid });
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
}

// Initialize fresh cart (clear old and create new)
export async function initializeFreshCart(): Promise<string | null> {
  // Clear any existing cart ID from localStorage
  clearCartId();

  // Create a new empty cart
  const newCartId = await createEmptyCart();

  if (newCartId) {
    setCartId(newCartId);
  }

  return newCartId;
}

// ============================================================================
// CHECKOUT TYPES AND FUNCTIONS
// ============================================================================

// Country Types
export interface Country {
  id: string;
  two_letter_abbreviation: string;
  full_name_locale: string;
  full_name_english: string;
}

export interface CountriesResponse {
  countries: Country[];
}

// Billing Address Types
export interface BillingAddressInput {
  firstname: string;
  lastname: string;
  company?: string;
  street: string[];
  city: string;
  region?: string;
  region_id?: number;
  postcode: string;
  country_code: string;
  telephone: string;
}

export interface BillingAddress {
  firstname: string;
  lastname: string;
  company: string | null;
  street: string[];
  city: string;
  region: {
    code: string;
    label: string;
  } | null;
  postcode: string;
  telephone: string;
  country: {
    code: string;
    label: string;
  };
}

export interface SetBillingAddressResponse {
  setBillingAddressOnCart: {
    cart: {
      billing_address: BillingAddress;
    };
  };
}

// Guest Email Types
export interface SetGuestEmailResponse {
  setGuestEmailOnCart: {
    cart: {
      email: string;
    };
  };
}

// Payment Method Types
export interface PaymentMethod {
  code: string;
  title: string;
}

export interface AvailablePaymentMethodsResponse {
  cart: {
    available_payment_methods: PaymentMethod[];
  };
}

export interface SetPaymentMethodResponse {
  setPaymentMethodOnCart: {
    cart: {
      selected_payment_method: {
        code: string;
        title: string;
      };
    };
  };
}

// Place Order Types
export interface PlaceOrderResponse {
  placeOrder: {
    order: {
      order_number: string;
    };
  };
}

// Cart Totals Types
export interface CartTotals {
  email?: string;
  prices: {
    grand_total: {
      value: number;
      currency: string;
    };
    subtotal_including_tax: {
      value: number;
      currency: string;
    };
    subtotal_excluding_tax: {
      value: number;
      currency: string;
    };
    applied_taxes: Array<{
      label: string;
      amount: {
        value: number;
        currency: string;
      };
    }>;
  };
  applied_coupons: Array<{
    code: string;
  }> | null;
}

export interface CartTotalsResponse {
  cart: CartTotals;
}

// Set guest email on cart
export async function setGuestEmailOnCart(
  cartId: string,
  email: string
): Promise<string | null> {
  const query = `
    mutation SetGuestEmail($cartId: String!, $email: String!) {
      setGuestEmailOnCart(
        input: {
          cart_id: $cartId
          email: $email
        }
      ) {
        cart {
          email
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<SetGuestEmailResponse>(query, {
      cartId,
      email,
    });
    return data.setGuestEmailOnCart.cart.email;
  } catch (error) {
    console.error('Error setting guest email:', error);
    throw error;
  }
}

// Get list of countries
export async function getCountries(): Promise<Country[]> {
  const query = `
    query {
      countries {
        id
        two_letter_abbreviation
        full_name_locale
        full_name_english
      }
    }
  `;

  try {
    const data = await graphqlFetch<CountriesResponse>(query);
    return data.countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

// Set billing address on cart
export async function setBillingAddressOnCart(
  cartId: string,
  address: BillingAddressInput
): Promise<BillingAddress | null> {
  const query = `
    mutation SetBillingAddress($cartId: String!, $address: CartAddressInput!) {
      setBillingAddressOnCart(
        input: {
          cart_id: $cartId
          billing_address: {
            address: $address
          }
        }
      ) {
        cart {
          billing_address {
            firstname
            lastname
            company
            street
            city
            region {
              code
              label
            }
            postcode
            telephone
            country {
              code
              label
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<SetBillingAddressResponse>(query, {
      cartId,
      address,
    });
    return data.setBillingAddressOnCart.cart.billing_address;
  } catch (error) {
    console.error('Error setting billing address:', error);
    throw error;
  }
}

// Get available payment methods
export async function getAvailablePaymentMethods(
  cartId: string
): Promise<PaymentMethod[]> {
  const query = `
    query GetPaymentMethods($cartId: String!) {
      cart(cart_id: $cartId) {
        available_payment_methods {
          code
          title
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<AvailablePaymentMethodsResponse>(query, {
      cartId,
    });
    return data.cart.available_payment_methods;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

// Set payment method on cart
export async function setPaymentMethodOnCart(
  cartId: string,
  paymentMethodCode: string
): Promise<{ code: string; title: string } | null> {
  const query = `
    mutation SetPaymentMethod($cartId: String!, $paymentMethodCode: String!) {
      setPaymentMethodOnCart(
        input: {
          cart_id: $cartId
          payment_method: {
            code: $paymentMethodCode
          }
        }
      ) {
        cart {
          selected_payment_method {
            code
            title
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<SetPaymentMethodResponse>(query, {
      cartId,
      paymentMethodCode,
    });
    return data.setPaymentMethodOnCart.cart.selected_payment_method;
  } catch (error) {
    console.error('Error setting payment method:', error);
    throw error;
  }
}

// Place order
export async function placeOrder(cartId: string): Promise<string | null> {
  const query = `
    mutation PlaceOrder($cartId: String!) {
      placeOrder(
        input: {
          cart_id: $cartId
        }
      ) {
        order {
          order_number
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<PlaceOrderResponse>(query, { cartId });
    return data.placeOrder.order.order_number;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}

// Get cart totals (summary)
export async function getCartTotals(cartId: string): Promise<CartTotals | null> {
  const query = `
    query GetCartTotals($cartId: String!) {
      cart(cart_id: $cartId) {
        email
        prices {
          grand_total {
            value
            currency
          }
          subtotal_including_tax {
            value
            currency
          }
          subtotal_excluding_tax {
            value
            currency
          }
          applied_taxes {
            label
            amount {
              value
              currency
            }
          }
        }
        applied_coupons {
          code
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<CartTotalsResponse>(query, { cartId });
    return data.cart;
  } catch (error) {
    console.error('Error fetching cart totals:', error);
    return null;
  }
}
