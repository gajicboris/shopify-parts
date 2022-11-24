// Step 1. Add and initialize your third-party JavaScript pixel (make sure to exclude HTML)
!function(e){if(!window.pintrk){window.pintrk = function () {
window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
  n=window.pintrk;n.queue=[],n.version="3.0";var
  t=document.createElement("script");t.async=!0,t.src=e;var
  r=document.getElementsByTagName("script")[0];
  r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");

pintrk('load', '0000000000000');
pintrk('page');

// Step 2. Subscribe to customer events using the analytics.subscribe() API
//  analytics.subscribe("event_name", event => {
//    pixel("track", "event_name", event.data);
//  });

// integrate third-party pixel tracking
analytics.subscribe("page_viewed", event => {
  pintrk('track', 'pagevisit');
});

analytics.subscribe("product_viewed", async (event) => {
  console.log(event)
  pintrk('track', 'pagevisit', {line_items: [{ 
    product_id: event.data.productVariant.product.id, 
    product_name: event.data.productVariant.product.title
  }]});
});

analytics.subscribe("search_submitted", async (event) => {
  pintrk('track', 'search', { search_query: event.data.searchResult.query });
});

analytics.subscribe("product_added_to_cart", async (event) => {
  if(event.data.cartLine.merchandise.price.amount > 0) {
    pintrk('track', 'addtocart', {
      currency: event.data.cartLine.merchandise.price.currencyCode,
      value: event.data.cartLine.merchandise.price.amount,
      order_quantity: event.data.quantity,
      line_items: [{ 
          product_id: event.data.cartLine.merchandise.product.id, 
          product_name: event.data.cartLine.merchandise.product.title,
          product_price: event.data.cartLine.merchandise.price.amount,
          product_quantity: event.data.quantity
        }]
    });    
  }
});

analytics.subscribe("checkout_completed", async (event) => {
  if(event.data.checkout.totalPrice.amount > 0) {
    let items = []
    for (const item of event.data.checkout.lineItems) {
      items.push({
        product_id: item.variant.product.id,
        product_name: item.title,
        product_price: item.variant.price.amount,
        product_quantity: item.quantity
      });
    }
    pintrk('set', { em: event.data.checkout.email });
    pintrk('track', 'checkout', {
      order_id: event.data.checkout.order.id,
      value: event.data.checkout.totalPrice.amount.toFixed(2),
      currency: event.data.checkout.totalPrice.currencyCode,
      order_quantity: items.length,
      line_items: items
    });    
  }
});
