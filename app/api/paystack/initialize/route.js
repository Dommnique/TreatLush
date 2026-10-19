import products from "@/data/products";

const DELIVERY_PRICE = 3000;

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, cart } = body;

    // Validate the basic checkout information.
    if (
      !customer ||
      typeof customer.email !== "string" ||
      !customer.email.trim() ||
      !Array.isArray(cart) ||
      cart.length === 0
    ) {
      return Response.json(
        {
          status: false,
          message: "Valid customer details and cart items are required.",
        },
        { status: 400 }
      );
    }

    // Recalculate the subtotal using trusted product prices.
    let subtotal = 0;
    const verifiedCart = [];

    for (const item of cart) {
      const product = products.find(
        (product) => String(product.id) === String(item.id)
      );

      if (
        !product ||
        !Number.isSafeInteger(item.cartQuantity) ||
        item.cartQuantity < 1 ||
        !Number.isSafeInteger(product.price) ||
        product.price < 0
      ) {
        return Response.json(
          {
            status: false,
            message: "The cart contains an invalid product or quantity.",
          },
          { status: 400 }
        );
      }

      subtotal += product.price * item.cartQuantity;

      if (!Number.isSafeInteger(subtotal)) {
        return Response.json(
          {
            status: false,
            message: "The order total is invalid.",
          },
          { status: 400 }
        );
      }

      verifiedCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: item.cartQuantity,
      });
    }

    // The server, not the browser, determines the amount to charge.
    const total = subtotal + DELIVERY_PRICE;
    const amountInKobo = total * 100;

    if (!Number.isSafeInteger(amountInKobo) || amountInKobo <= 0) {
      return Response.json(
        {
          status: false,
          message: "The order amount is invalid.",
        },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return Response.json(
        {
          status: false,
          message: "Payment service is not configured.",
        },
        { status: 500 }
      );
    }

    const paystackData = {
      email: customer.email.trim(),
      amount: amountInKobo,
      currency: "NGN",
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
      metadata: {
        customer: {
          fullName: customer.fullName.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
          city: customer.city.trim(),
          state: customer.state,
          deliveryNote: customer.deliveryNote?.trim() || "",
        },
        products: verifiedCart,
        subtotal,
        deliveryPrice: DELIVERY_PRICE,
        expectedTotal: total,
      },
    };

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify(paystackData),
        cache: "no-store",
      }
    );

    const responseFromPaystack = await response.json();

    if (!response.ok || !responseFromPaystack.status) {
      console.error(
        "Paystack initialization failed:",
        responseFromPaystack.message
      );

      return Response.json(
        {
          status: false,
          message: "Unable to initialize payment. Please try again.",
        },
        { status: 502 }
      );
    }

    return Response.json({
      status: true,
      data: responseFromPaystack.data,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);

    return Response.json(
      {
        status: false,
        message: "Something went wrong while initializing payment.",
      },
      { status: 500 }
    );
  }
}
