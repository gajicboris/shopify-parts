// Step 1. Add and initialize your third-party JavaScript pixel (make sure to exclude HTML)
const script = document.createElement('script');
script.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-XXXXX');
script.setAttribute('async', '');
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-XXXXX');

// Step 2. Subscribe to customer events using the analytics.subscribe() API
//  analytics.subscribe("event_name", event => {
//    pixel("track", "event_name", event.data);
//  });

analytics.subscribe("page_viewed", async (event) => {
  let data = {
    page_location: event.context.document.location.href,
    page_title: event.context.document.title,
    language: event.context.language,
  }
  gtag("event", "page_view", data);
});

analytics.subscribe("product_viewed", async (event) => {
  let data = {
    currency: event.data.productVariant.price.currencyCode,
    value: event.data.productVariant.price.amount,
    items: [
      { 
        item_id: event.data.productVariant.id, 
        item_name: event.data.productVariant.product.title 
      }
    ],
  };
  gtag("event", "view_item", data);
});

analytics.subscribe("search_submitted", async (event) => {
  gtag("event", "search", { search_term: event.data.searchResult.query });
});

analytics.subscribe("product_added_to_cart", async (event) => {
  if(event.data.cartLine.merchandise.price.amount > 0) {
    let data = {
      currency: event.data.cartLine.merchandise.price.currencyCode,
      value: event.data.cartLine.merchandise.price.amount,
      items: [
        { 
          item_id: event.data.cartLine.merchandise.product.id, 
          item_name: event.data.cartLine.merchandise.product.title,
          price: event.data.cartLine.merchandise.price.amount,
          quantity: event.data.quantity
        }
      ],
    }
    gtag("event", "add_to_cart", data);
  }
});

analytics.subscribe("checkout_started", async (event) => {
  if(event.data.checkout.totalPrice.amount > 0) {
    let items = []
    for (const item of event.data.checkout.lineItems) {
      items.push({
        item_id: item.variant.product.id,
        item_name: item.variant.product.title,
      });
    }
    let data = {
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      items: items,
    }
    gtag("event", "begin_checkout", data);
  }
});

analytics.subscribe("payment_info_submitted", async (event) => {
  if(event.data.checkout.totalPrice.amount > 0) {
    let items = []
    for (const item of event.data.checkout.lineItems) {
      items.push({
        item_id: item.variant.product.id,
        item_name: item.variant.product.title,
      });
    }
    let data = {
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      items: items
    }
    gtag("event", "add_payment_info", data);
  }
});

analytics.subscribe("checkout_completed", async (event) => {
  if(event.data.checkout.totalPrice.amount > 0) {
    let items = []
    for (const item of event.data.checkout.lineItems) {
      items.push({
        item_id: item.variant.product.id,
        item_name: item.variant.product.title,
      });
    }
    let data = {
      transaction_id: event.data.checkout.order.id,
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      items: items
    }
    gtag("event", "purchase", data);
  }
});
