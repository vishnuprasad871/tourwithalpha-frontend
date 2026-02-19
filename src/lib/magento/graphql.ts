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

// Customizable Option Types
export type PriceTypeEnum = 'FIXED' | 'PERCENT' | 'DYNAMIC';

export interface CustomizableOptionValue {
  option_type_id: number;
  title: string;
  price: number;
  price_type: PriceTypeEnum;
  sku: string | null;
  sort_order: number;
}

export interface CustomizableOptionBase {
  __typename: string;
  title: string;
  required: boolean;
  sort_order: number;
  option_id: number;
}

export interface CustomizableDropDownOption extends CustomizableOptionBase {
  __typename: 'CustomizableDropDownOption';
  value: CustomizableOptionValue[];
}

export interface CustomizableRadioOption extends CustomizableOptionBase {
  __typename: 'CustomizableRadioOption';
  value: CustomizableOptionValue[];
}

export interface CustomizableCheckboxOption extends CustomizableOptionBase {
  __typename: 'CustomizableCheckboxOption';
  value: CustomizableOptionValue[];
}

export interface CustomizableMultipleOption extends CustomizableOptionBase {
  __typename: 'CustomizableMultipleOption';
  value: CustomizableOptionValue[];
}

export interface CustomizableDateOption extends CustomizableOptionBase {
  __typename: 'CustomizableDateOption';
}

export interface CustomizableFieldOption extends CustomizableOptionBase {
  __typename: 'CustomizableFieldOption';
}

export type CustomizableOption =
  | CustomizableDropDownOption
  | CustomizableRadioOption
  | CustomizableCheckboxOption
  | CustomizableMultipleOption
  | CustomizableDateOption
  | CustomizableFieldOption;

// Media Gallery Types
export interface MediaGalleryItem {
  disabled: boolean;
  label: string | null;
  position: number;
  url: string;
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
  options?: CustomizableOption[];
  enquiry_only?: boolean | number | null;
  media_gallery?: MediaGalleryItem[];
}

export interface ProductsResponse {
  products: {
    items: Product[];
  };
}

// ============================================================================
// BOOKING PRODUCTS TYPES AND FUNCTIONS
// ============================================================================

// Simplified product type for booking listings
export interface BookingProduct {
  name: string;
  sku: string;
  url_key: string;
  price_range: {
    maximum_price: {
      final_price: {
        currency: string;
        value: number;
      };
    };
  };
  image: {
    label: string | null;
    url: string;
  };
  media_gallery: {
    url: string;
  }[];
}

export interface BookingProductsResponse {
  products: {
    items: BookingProduct[];
  };
}

// Fetch all products from the booking category
export async function getBookingProducts(): Promise<BookingProduct[]> {
  const query = `
    query GetBookingProducts {
      products(
        filter: {
          category_url_path: {
            eq: "booking"
          }
        }
      ) {
        items {
          name
          sku
          url_key
          price_range {
            maximum_price {
              final_price {
                currency
                value
              }
            }
          }
          image {
            label
            url
          }
          media_gallery {
            url
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlFetch<BookingProductsResponse>(query);
    return data.products.items;
  } catch (error) {
    console.error('Error fetching booking products:', error);
    return [];
  }
}

// ============================================================================
// BOOKING AVAILABILITY TYPES AND FUNCTIONS
// ============================================================================

export interface BookingDate {
  allowed_qty: number;
  count: number;
  date: string;
  qty_total: number;
  remaining_qty: number;
}

export interface BookingAvailability {
  bookings: BookingDate[];
  message: string;
  sku: string;
  success: boolean;
  total_bookings: number;
}

export interface BookingCountBySkuResponse {
  bookingCountBySku: BookingAvailability;
}

// Get booking availability for a product by SKU
export async function getBookingAvailability(sku: string): Promise<BookingAvailability | null> {
  const query = `
    query GetBookingAvailability($sku: String!) {
      bookingCountBySku(sku: $sku) {
        bookings {
          allowed_qty
          count
          date
          qty_total
          remaining_qty
        }
        message
        sku
        success
        total_bookings
      }
    }
  `;

  try {
    const data = await graphqlFetch<BookingCountBySkuResponse>(query, { sku });
    return data.bookingCountBySku;
  } catch (error) {
    console.error('Error fetching booking availability:', error);
    return null;
  }
}

// Get availability for a specific date
export function getAvailabilityForDate(
  availability: BookingAvailability | null,
  date: string,
  defaultAllowedQty: number = 12
): { remaining: number; allowed: number; hasBooking: boolean } {
  if (!availability || !availability.success) {
    return { remaining: defaultAllowedQty, allowed: defaultAllowedQty, hasBooking: false };
  }

  // Get allowed_qty from any existing booking (it's the same product-level limit)
  const productAllowedQty = availability.bookings.length > 0
    ? availability.bookings[0].allowed_qty
    : defaultAllowedQty;

  const booking = availability.bookings.find((b) => b.date === date);
  if (booking) {
    return {
      remaining: booking.remaining_qty,
      allowed: booking.allowed_qty,
      hasBooking: true,
    };
  }

  // No bookings for this date, full capacity available
  return { remaining: productAllowedQty, allowed: productAllowedQty, hasBooking: false };
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
          stock_status
          special_price
          enquiry_only
          media_gallery {
              disabled
              label
              position
              url
          }
          image {
            url
          }
          short_description {
            html
          }
          price_range {
            maximum_price {
              final_price {
                value
                currency
              }
            }
          }
          ... on CustomizableProductInterface {
            options {
              __typename
              title
              required
              sort_order
              option_id
              ... on CustomizableDropDownOption {
                value {
                  option_type_id
                  title
                  price
                  price_type
                  sku
                  sort_order
                }
              }
              ... on CustomizableRadioOption {
                value {
                  option_type_id
                  title
                  price
                  price_type
                  sku
                  sort_order
                }
              }
              ... on CustomizableCheckboxOption {
                value {
                  option_type_id
                  title
                  price
                  price_type
                  sku
                  sort_order
                }
              }
              ... on CustomizableMultipleOption {
                value {
                  option_type_id
                  title
                  price
                  price_type
                  sku
                  sort_order
                }
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


// Customizable Option Input for Cart
export interface CustomizableOptionInput {
  id: number;
  value_string: string;
}

// Cart Item Input for virtual products
interface VirtualCartItemInput {
  data: {
    quantity: number;
    sku: string;
  };
  customizable_options?: CustomizableOptionInput[];
}

interface AddVirtualProductsInput {
  cart_id: string;
  cart_items: VirtualCartItemInput[];
}

// Add virtual product to cart with customizable options
export async function addToCart(
  cartId: string,
  sku: string,
  quantity: number,
  customizableOptions?: CustomizableOptionInput[]
): Promise<Cart | null> {
  const query = `
    mutation AddVirtualProductsToCart($input: AddVirtualProductsToCartInput!) {
      addVirtualProductsToCart(input: $input) {
        cart {
          items {
            product {
              name
              sku
            }
            quantity
          }
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

  // Build the cart item
  const cartItem: VirtualCartItemInput = {
    data: {
      quantity,
      sku,
    },
  };

  // Add customizable options if provided
  if (customizableOptions && customizableOptions.length > 0) {
    cartItem.customizable_options = customizableOptions.map(opt => ({
      id: opt.id,
      value_string: opt.value_string,
    }));
  }

  const input: AddVirtualProductsInput = {
    cart_id: cartId,
    cart_items: [cartItem],
  };

  try {
    const data = await graphqlFetch<AddToCartResponse>(query, { input });
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
      paymentlink: string | null;
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
export async function placeOrder(
  cartId: string
): Promise<{ orderNumber: string; paymentlink: string | null } | null> {
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
        paymentlink
      }
    }
  `;

  try {
    const data = await graphqlFetch<PlaceOrderResponse>(query, { cartId });
    const { order_number, paymentlink } = data.placeOrder.order;
    return { orderNumber: order_number, paymentlink: paymentlink ?? null };
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
