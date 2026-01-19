// src/pages/Checkout/Shipping.jsx
import React, { useState } from "react";
import styles from "./Checkout.module.css";
import { useCart } from "../../store/CartContext";
import OrderSummary from "./OrderSummary";
import PRODUCTS from "../../data/products.json"; // adjust path if needed

// Validation patterns
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  cardNumber: /^\d{13,19}$/,
  expDate: /^(0[1-9]|1[0-2])\s?\/?\s?([0-9]{2})$/,
  cvc: /^\d{3,4}$/,
  phone: /^[\d\s\-+()]{7,20}$/,
  postcode: /^[A-Za-z0-9\s\-]{3,10}$/,
};

// Format card number with spaces (4-4-4-4)
const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(' ');
};

// Format expiry date (MM/YY)
const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }
  return digits;
};

export default function Checkout() {
  const { items, count, total, addItem } = useCart();

  // local UI state (presentational)
  const [shipProtect, setShipProtect] = useState(false);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [payMethod, setPayMethod] = useState("card"); // "card" | "paypal"
  const [showBrandsTip, setShowBrandsTip] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case 'contactEmail':
        if (!value) return 'Email is required';
        if (!PATTERNS.email.test(value)) return 'Enter a valid email address';
        break;
      case 'firstName':
      case 'lastName':
        if (!value) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.length < 2) return 'Name must be at least 2 characters';
        break;
      case 'address1':
        if (!value) return 'Address is required';
        break;
      case 'city':
        if (!value) return 'City is required';
        break;
      case 'postcode':
        if (!value) return 'Postcode is required';
        if (!PATTERNS.postcode.test(value)) return 'Enter a valid postcode';
        break;
      case 'country':
        if (!value) return 'Country is required';
        break;
      case 'ccNumber':
        if (payMethod === 'card') {
          const digits = value.replace(/\D/g, '');
          if (!digits) return 'Card number is required';
          if (!PATTERNS.cardNumber.test(digits)) return 'Enter a valid card number';
        }
        break;
      case 'ccExp':
        if (payMethod === 'card') {
          if (!value) return 'Expiration date is required';
          if (!PATTERNS.expDate.test(value.replace(/\s/g, ''))) return 'Enter a valid date (MM/YY)';
        }
        break;
      case 'ccCvc':
        if (payMethod === 'card') {
          if (!value) return 'Security code is required';
          if (!PATTERNS.cvc.test(value)) return 'Enter a valid CVC';
        }
        break;
      case 'ccName':
        if (payMethod === 'card' && !value) return 'Name on card is required';
        break;
      default:
        break;
    }
    return null;
  };

  // Validate entire form
  const validateForm = (formData) => {
    const newErrors = {};
    const requiredFields = ['contactEmail', 'firstName', 'lastName', 'address1', 'city', 'postcode', 'country'];

    if (payMethod === 'card') {
      requiredFields.push('ccNumber', 'ccExp', 'ccCvc', 'ccName');
    }

    for (const field of requiredFields) {
      const error = validateField(field, formData.get(field));
      if (error) newErrors[field] = error;
    }

    return newErrors;
  };

  // Handle input blur for real-time validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle card number formatting
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    e.target.value = formatted;
  };

  // Handle expiry date formatting
  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    e.target.value = formatted;
  };

  // Handle CVC input (digits only)
  const handleCvcChange = (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error field
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      element?.focus();
      return;
    }

    setIsSubmitting(true);
    // TODO: Process payment and route to confirmation
    // For now, just simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Order submitted! (This is a demo)');
    }, 1500);
  };

    // inside your component, after you have access to `items` from useCart()
    const cartLines = Object.values(items || {});
    const cartIds = new Set(cartLines.map(l => l?.product?.id).filter(Boolean));
    const cartCats = cartLines.map(l => l?.product?.category).filter(Boolean);

    // helper: find the most common value
    const mode = (arr) => {
    const m = new Map();
    arr.forEach(v => m.set(v, (m.get(v) || 0) + 1));
    let best = null, max = 0;
    for (const [k, n] of m) if (n > max) { best = k; max = n; }
    return best;
    };

    const targetCategory = mode(cartCats) || PRODUCTS[0]?.category;

    // pool: same category, not already in cart
    let pool = PRODUCTS.filter(p => p.category === targetCategory && !cartIds.has(p.id));

    // fallback if <3 found
    if (pool.length < 3) {
    const extras = PRODUCTS.filter(p => !cartIds.has(p.id) && p.category !== targetCategory);
    pool = [...pool, ...extras];
    }

    // shuffle + take 3
    const recommended = [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

    // money format
    const fmtMoney = (n, currency = "USD", locale = "en-US") =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(n || 0));


  return (
    <div className={styles.shippingPage}>
      <div className={styles.contentGrid}>
        {/* Left column: one-page checkout form */}
        <section className={styles.formCard} aria-label="Checkout">
          <form className={styles.formBody} onSubmit={onSubmit} noValidate>
            {/* =======================
                Contact
               ======================= */}
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>Contact</h2>
              <button type="button" className={styles.linkInline}>
                Sign in
              </button>
            </div>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder=" "
                  className={`${styles.hasFloat} ${errors.contactEmail ? styles.hasError : ''}`}
                  required
                  autoComplete="email"
                  aria-label="Email address"
                  aria-invalid={!!errors.contactEmail}
                  aria-describedby={errors.contactEmail ? 'contactEmail-error' : undefined}
                  onBlur={handleBlur}
                />
                <label htmlFor="contactEmail" className={styles.floatLabel}>
                  Email
                </label>
                {errors.contactEmail && (
                  <span id="contactEmail-error" className={styles.fieldError}>{errors.contactEmail}</span>
                )}
              </div>
            </div>

            <label className={styles.checkRow}>
              <input type="checkbox" />
              <span>Email me with news and offers</span>
            </label>

            {/* =======================
                Shipping Protection
               ======================= */}
            <div className={styles.cardRow}>
              <label className={styles.cardRowLeft}>
                <input
                  type="checkbox"
                  checked={shipProtect}
                  onChange={(e) => setShipProtect(e.target.checked)}
                />
                <span className={styles.protectIconWrap}>
                  <img src="/assets/CheckSecurityShield.png" alt="" />
                </span>
                <div className={styles.cardCol}>
                  <div className={styles.cardTitle}>Shipping Protection (Incl. Priority)</div>
                  <div className={styles.cardSub}>
                    Ship smarter with built-in Protection and Priority Shipping 🚚💨
                  </div>
                </div>
              </label>
              <div className={styles.cardPrice}>£3.00</div>
            </div>



<br />
            {/* =======================
                Delivery (Shipping address)
               ======================= */}
            <h2 className={styles.sectionTitle}>Delivery</h2>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <select
                  id="country"
                  name="country"
                  className={`${styles.hasFloat} ${errors.country ? styles.hasError : ''}`}
                  required
                  defaultValue=""
                  autoComplete="country"
                  aria-label="Country or region"
                  aria-invalid={!!errors.country}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                  onBlur={handleBlur}
                >
                  <option value="" disabled hidden></option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="EU">European Union</option>
                </select>
                <label htmlFor="country" className={styles.floatLabel}>
                  Country/Region
                </label>
                {errors.country && (
                  <span id="country-error" className={styles.fieldError}>{errors.country}</span>
                )}
              </div>
            </div>

            <div className={styles.rowTwo}>
              <div className={styles.float}>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder=" "
                  className={`${styles.hasFloat} ${errors.firstName ? styles.hasError : ''}`}
                  required
                  autoComplete="given-name"
                  aria-label="First name"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  onBlur={handleBlur}
                />
                <label htmlFor="firstName" className={styles.floatLabel}>
                  First name
                </label>
                {errors.firstName && (
                  <span id="firstName-error" className={styles.fieldError}>{errors.firstName}</span>
                )}
              </div>

              <div className={styles.float}>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder=" "
                  className={`${styles.hasFloat} ${errors.lastName ? styles.hasError : ''}`}
                  required
                  autoComplete="family-name"
                  aria-label="Last name"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  onBlur={handleBlur}
                />
                <label htmlFor="lastName" className={styles.floatLabel}>
                  Last name
                </label>
                {errors.lastName && (
                  <span id="lastName-error" className={styles.fieldError}>{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="address1"
                  name="address1"
                  type="text"
                  placeholder=" "
                  className={`${styles.hasFloat} ${errors.address1 ? styles.hasError : ''}`}
                  required
                  autoComplete="address-line1"
                  aria-label="Street address"
                  aria-invalid={!!errors.address1}
                  aria-describedby={errors.address1 ? 'address1-error' : undefined}
                  onBlur={handleBlur}
                />
                <label htmlFor="address1" className={styles.floatLabel}>
                  Address
                </label>
                {errors.address1 && (
                  <span id="address1-error" className={styles.fieldError}>{errors.address1}</span>
                )}
              </div>
            </div>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="address2"
                  name="address2"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                  autoComplete="address-line2"
                  aria-label="Apartment, suite, etc."
                />
                <label htmlFor="address2" className={styles.floatLabel}>
                  Apartment, suite, etc. (optional)
                </label>
              </div>
            </div>

            <div className={styles.rowTwo}>
              <div className={styles.float}>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder=" "
                  className={`${styles.hasFloat} ${errors.city ? styles.hasError : ''}`}
                  required
                  autoComplete="address-level2"
                  aria-label="City"
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  onBlur={handleBlur}
                />
                <label htmlFor="city" className={styles.floatLabel}>
                  City
                </label>
                {errors.city && (
                  <span id="city-error" className={styles.fieldError}>{errors.city}</span>
                )}
              </div>

              <div className={styles.float}>
                <input
                  id="postcode"
                  name="postcode"
                  type="text"
                  placeholder=" "
                  className={`${styles.hasFloat} ${errors.postcode ? styles.hasError : ''}`}
                  required
                  autoComplete="postal-code"
                  aria-label="Postcode"
                  aria-invalid={!!errors.postcode}
                  aria-describedby={errors.postcode ? 'postcode-error' : undefined}
                  onBlur={handleBlur}
                />
                <label htmlFor="postcode" className={styles.floatLabel}>
                  Postcode
                </label>
                {errors.postcode && (
                  <span id="postcode-error" className={styles.fieldError}>{errors.postcode}</span>
                )}
              </div>
            </div>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder=" "
                  className={styles.hasFloat}
                  autoComplete="tel"
                  aria-label="Phone number"
                />
                <label htmlFor="phone" className={styles.floatLabel}>
                  Phone
                </label>
              </div>
            </div>

            <label className={styles.checkRow}>
              <input type="checkbox" />
              <span>Text me with news and offers</span>
            </label>

<br />
            {/* =======================
                Upsells (stub)
               ======================= */}
           {/* inside your upsell block, replace the hardcoded array with this */}
<div className={styles.upsellRow}>
  {recommended.map((p) => (
    <div key={p.id} className={styles.productCard}>

<div className={styles.productImgWrapper}>
  <img src={p.image} alt="" className={styles.productImg} />
</div>


      <div className={styles.productTitle}>{p.name}</div>
      <div className={styles.productPrice}>{fmtMoney(p.price)}</div>

      <div className={styles.productQtyRow}>
        <label className={styles.qtyLabel} htmlFor={`qty-${p.id}`}>Quantity</label>
        <select id={`qty-${p.id}`} className={styles.qtySelect} defaultValue={1}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className={styles.addToOrderBtn}
        onClick={(e) => {
          const qty = Number(
            (e.currentTarget.parentElement.querySelector(`#qty-${p.id}`) || {}).value || 1
          );
          // add to cart if you have addItem available:
          addItem?.(
            {
              id: p.id,
              name: p.name,
              image: p.image,
              price: p.price,
              slug: p.slug,
              category: p.category,
              status: p.status,
              skill: p.skill,
            },
            qty
          );
        }}
      >
        Add to order
      </button>
    </div>
  ))}
</div>


            {/* =======================
                Payment
               ======================= */}
            <h2 className={styles.sectionTitle}>Payment</h2>
            <p className={styles.noteTiny}>All transactions are secure and encrypted.</p>

            {/* Payment method radios */}
            <div className={styles.paymentMethodList} role="radiogroup" aria-label="Payment method">
        <label
  className={`${styles.radioRow} ${
    payMethod === "card" ? styles.radioActive : ""
  }`}
>
  <input
    type="radio"
    name="payMethod"
    value="card"
    checked={payMethod === "card"}
    onChange={() => setPayMethod("card")}
  />
  <span className={styles.radioLabel}>
    Credit card

    {/* Visible brands + “+5” with tooltip */}
    <span
      className={styles.cardBrands}
      onMouseEnter={() => setShowBrandsTip(true)}
      onMouseLeave={() => setShowBrandsTip(false)}
    >
      <img className={styles.brandBadge} src="/assets/Visa.svg" alt="Visa" />
      <img
        className={styles.brandBadge}
        src="/assets/Mastercard.svg"
        alt="Mastercard"
      />
      <img className={styles.brandBadge} src="/assets/Amex.svg" alt="American Express" />

   

      
  
    </span>
  </span>
</label>

              {payMethod === "card" && (
                <div className={styles.cardPanel}>
                  <div className={styles.rowOne}>
                    <div className={styles.float}>
                      <input
                        id="ccNumber"
                        name="ccNumber"
                        inputMode="numeric"
                        placeholder=" "
                        className={`${styles.hasFloat} ${errors.ccNumber ? styles.hasError : ''}`}
                        maxLength={23}
                        autoComplete="cc-number"
                        aria-label="Card number"
                        aria-invalid={!!errors.ccNumber}
                        aria-describedby={errors.ccNumber ? 'ccNumber-error' : undefined}
                        onChange={handleCardNumberChange}
                        onBlur={handleBlur}
                      />
                      <label htmlFor="ccNumber" className={styles.floatLabel}>
                        Card number
                      </label>
                      {errors.ccNumber && (
                        <span id="ccNumber-error" className={styles.fieldError}>{errors.ccNumber}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.rowTwo}>
                    <div className={styles.float}>
                      <input
                        id="ccExp"
                        name="ccExp"
                        placeholder=" "
                        className={`${styles.hasFloat} ${errors.ccExp ? styles.hasError : ''}`}
                        maxLength={7}
                        autoComplete="cc-exp"
                        aria-label="Expiration date"
                        aria-invalid={!!errors.ccExp}
                        aria-describedby={errors.ccExp ? 'ccExp-error' : undefined}
                        onChange={handleExpiryChange}
                        onBlur={handleBlur}
                      />
                      <label htmlFor="ccExp" className={styles.floatLabel}>
                        Expiration date (MM / YY)
                      </label>
                      {errors.ccExp && (
                        <span id="ccExp-error" className={styles.fieldError}>{errors.ccExp}</span>
                      )}
                    </div>
                    <div className={styles.float}>
                      <input
                        id="ccCvc"
                        name="ccCvc"
                        inputMode="numeric"
                        placeholder=" "
                        className={`${styles.hasFloat} ${errors.ccCvc ? styles.hasError : ''}`}
                        maxLength={4}
                        autoComplete="cc-csc"
                        aria-label="Security code"
                        aria-invalid={!!errors.ccCvc}
                        aria-describedby={errors.ccCvc ? 'ccCvc-error' : undefined}
                        onChange={handleCvcChange}
                        onBlur={handleBlur}
                      />
                      <label htmlFor="ccCvc" className={styles.floatLabel}>
                        Security code
                      </label>
                      {errors.ccCvc && (
                        <span id="ccCvc-error" className={styles.fieldError}>{errors.ccCvc}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.rowOne}>
                    <div className={styles.float}>
                      <input
                        id="ccName"
                        name="ccName"
                        placeholder=" "
                        className={`${styles.hasFloat} ${errors.ccName ? styles.hasError : ''}`}
                        autoComplete="cc-name"
                        aria-label="Name on card"
                        aria-invalid={!!errors.ccName}
                        aria-describedby={errors.ccName ? 'ccName-error' : undefined}
                        onBlur={handleBlur}
                      />
                      <label htmlFor="ccName" className={styles.floatLabel}>
                        Name on card
                      </label>
                      {errors.ccName && (
                        <span id="ccName-error" className={styles.fieldError}>{errors.ccName}</span>
                      )}
                    </div>
                  </div>

                  {/* Divider + Express checkout */}
                  <div className={styles.dividerRow}>
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerLabel}>OR</span>
                    <span className={styles.dividerLine} />
                  </div>

                  <div className={styles.sectionBlock}>
                    <div className={styles.expressRow}>
                      <button type="button" className={`${styles.expressBtn1} ${styles.expressApple}`}>
                        <img src="/assets/ApplePay.svg" alt="" />
                        <span></span>
                      </button>
                      <button type="button" className={`${styles.expressBtn2} ${styles.expressPaypal}`}>
                        <img src="/assets/PayPal.svg" alt="" />
                        <span></span>
                      </button>
                      <button type="button" className={`${styles.expressBtn3} ${styles.expressGpay}`}>
                        <img src="/assets/sei_red_and_white.svg" alt="" />
                        <span></span>
                      </button>
                    </div>
                    <p className={styles.noteTiny}>
                      By continuing with your payment, you agree to the future charges listed on this
                      page and the cancellation policy.
                    </p>
                  </div>

                  {/* Billing address */}
                  <label className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={useShippingAsBilling}
                      onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                    />
                    <span>Use shipping address as billing address</span>
                  </label>

                  {!useShippingAsBilling && (
                    <>
                      <div className={styles.rowOne}>
                        <div className={styles.float}>
                          <select
                            id="billCountry"
                            name="billCountry"
                            className={styles.hasFloat}
                            defaultValue=""
                          >
                            <option value="" disabled hidden></option>
                            <option value="GB">United Kingdom</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="EU">European Union</option>
                          </select>
                          <label htmlFor="billCountry" className={styles.floatLabel}>
                            Country/Region
                          </label>
                        </div>
                      </div>

                      <div className={styles.rowTwo}>
                        <div className={styles.float}>
                          <input
                            id="billFirst"
                            placeholder=" "
                            className={styles.hasFloat}
                          />
                          <label htmlFor="billFirst" className={styles.floatLabel}>
                            First name
                          </label>
                        </div>
                        <div className={styles.float}>
                          <input
                            id="billLast"
                            placeholder=" "
                            className={styles.hasFloat}
                          />
                          <label htmlFor="billLast" className={styles.floatLabel}>
                            Last name
                          </label>
                        </div>
                      </div>

                      <div className={styles.rowOne}>
                        <div className={styles.float}>
                          <input
                            id="billAddress1"
                            placeholder=" "
                            className={styles.hasFloat}
                          />
                          <label htmlFor="billAddress1" className={styles.floatLabel}>
                            Address
                          </label>
                        </div>
                      </div>

                      <div className={styles.rowOne}>
                        <div className={styles.float}>
                          <input
                            id="billAddress2"
                            placeholder=" "
                            className={styles.hasFloat}
                          />
                          <label htmlFor="billAddress2" className={styles.floatLabel}>
                            Apartment, suite, etc. (optional)
                          </label>
                        </div>
                      </div>

                      <div className={styles.rowTwo}>
                        <div className={styles.float}>
                          <input
                            id="billCity"
                            placeholder=" "
                            className={styles.hasFloat}
                          />
                          <label htmlFor="billCity" className={styles.floatLabel}>
                            City
                          </label>
                        </div>
                        <div className={styles.float}>
                          <input
                            id="billPost"
                            placeholder=" "
                            className={styles.hasFloat}
                          />
                          <label htmlFor="billPost" className={styles.floatLabel}>
                            Postcode
                          </label>
                        </div>
                      </div>

                      <div className={styles.rowOne}>
                        <div className={styles.float}>
                          <input
                            id="billPhone"
                            placeholder=" "
                            className={styles.hasFloat}
                          />
                          <label htmlFor="billPhone" className={styles.floatLabel}>
                            Phone (optional)
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* =======================
                Save / Secure / Submit
               ======================= */}
            <label className={styles.checkRow}>
              <input type="checkbox" />
              <span>Save my information for a faster checkout</span>
            </label>

            <button
              type="submit"
              className={styles.payNowBtn}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Pay now'}
            </button>

            <div className={styles.footerLinks}>
              <a href="/" rel="nofollow">Refund policy</a>
              <a href="/" rel="nofollow">Privacy policy</a>
              <a href="/" rel="nofollow">Terms of service</a>
              <a href="/" rel="nofollow">Cancellations</a>
            </div>
          </form>
        </section>

        {/* Right column: shared Order Summary */}
 <OrderSummary
  count={count}
  subtotal={+total.toFixed(2)}
  tax={0}                 // hidden unless you pass showTax
  total={+total.toFixed(2)}
  showCheckoutCta={false}
  shippingPending={true}  // ← shows “Enter shipping address”
  currencySymbol="$"
  currencyCode="USD"
/>

      </div>
    </div>
  );
}
