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
