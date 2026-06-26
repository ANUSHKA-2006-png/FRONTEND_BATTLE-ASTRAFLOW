const pricingMatrix = {
  annualDiscount: 0.8,
  billing: {
    monthly: { months: 1, period: "mo", label: "monthly" },
    annual: { months: 12, period: "yr", label: "annual" }
  },
  currencies: {
    USD: { symbol: "$", conversion: 1, regionalTariff: 1, locale: "en-US" },
    INR: { symbol: "\u20B9", conversion: 83, regionalTariff: 0.82, locale: "en-IN" },
    EUR: { symbol: "\u20AC", conversion: 0.93, regionalTariff: 1.06, locale: "de-DE" }
  },
  tiers: {
    launch: { baseMonthlyUsd: 49 },
    scale: { baseMonthlyUsd: 129 },
    autonomous: { baseMonthlyUsd: 299 }
  }
};

const pageSections = [
  { label: "Platform", href: "#platform", terms: "connected data fabric source lineage automation" },
  { label: "Features", href: "#features", terms: "bento accordion workflow compiler recovery loops" },
  { label: "Pricing", href: "#pricing", terms: "currency annual monthly tariff matrix pricing" },
  { label: "Proof", href: "#proof", terms: "customer proof testimonial trust operators" }
];

const formatPrice = (amount, currency) => {
  const config = pricingMatrix.currencies[currency];
  return new Intl.NumberFormat(config.locale, {
    maximumFractionDigits: 0
  }).format(Math.round(amount));
};

const calculatePrice = (tierKey, currencyKey, billingKey) => {
  const tier = pricingMatrix.tiers[tierKey];
  const currency = pricingMatrix.currencies[currencyKey];
  const billing = pricingMatrix.billing[billingKey];
  const billingMultiplier = billingKey === "annual" ? pricingMatrix.annualDiscount : 1;

  return tier.baseMonthlyUsd * billing.months * billingMultiplier * currency.conversion * currency.regionalTariff;
};

const initPricing = () => {
  const billingToggle = document.querySelector("[data-billing-toggle]");
  const currencySelect = document.querySelector("[data-currency-select]");
  const priceRows = [...document.querySelectorAll("[data-tier]")].map((card) => ({
    tier: card.dataset.tier,
    symbol: card.querySelector("[data-price-symbol]"),
    value: card.querySelector("[data-price-value]"),
    period: card.querySelector("[data-price-period]"),
    note: card.querySelector("[data-price-note]")
  }));

  let activeBilling = "monthly";
  let activeCurrency = "USD";

  const updatePrices = () => {
    const currency = pricingMatrix.currencies[activeCurrency];
    const billing = pricingMatrix.billing[activeBilling];

    priceRows.forEach((row) => {
      const price = calculatePrice(row.tier, activeCurrency, activeBilling);
      const monthlyBenchmark = calculatePrice(row.tier, activeCurrency, "monthly") * 12;
      const annualSavings = monthlyBenchmark - calculatePrice(row.tier, activeCurrency, "annual");

      row.symbol.textContent = currency.symbol;
      row.value.textContent = formatPrice(price, activeCurrency);
      row.period.textContent = `/${billing.period}`;
      row.note.textContent =
        activeBilling === "annual"
          ? `Includes ${currency.symbol}${formatPrice(annualSavings, activeCurrency)} annual matrix savings`
          : `Base ${billing.label} rate with ${activeCurrency} regional tariff`;
    });
  };

  billingToggle?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-billing]");
    if (!button || button.dataset.billing === activeBilling) return;

    activeBilling = button.dataset.billing;
    billingToggle.querySelectorAll("[data-billing]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    updatePrices();
  });

  currencySelect?.addEventListener("change", (event) => {
    activeCurrency = event.target.value;
    updatePrices();
  });

  updatePrices();
};

const initFeatureShell = () => {
  const shell = document.querySelector("[data-feature-shell]");
  if (!shell) return;

  const nodes = [...shell.querySelectorAll("[data-feature-index]")];
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  let activeIndex = Number(nodes.find((node) => node.classList.contains("is-active"))?.dataset.featureIndex || 0);

  const syncHeights = () => {
    nodes.forEach((node) => {
      const body = node.querySelector(".feature-body");
      if (!body) return;
      if (mobileQuery.matches) {
        body.style.maxHeight = node.classList.contains("is-active") ? `${body.scrollHeight}px` : "0px";
      } else {
        body.style.maxHeight = "";
      }
    });
  };

  const setActive = (index) => {
    activeIndex = index;
    nodes.forEach((node) => {
      const isActive = Number(node.dataset.featureIndex) === activeIndex;
      node.classList.toggle("is-active", isActive);
      node
        .querySelector(".feature-trigger")
        ?.setAttribute("aria-expanded", String(mobileQuery.matches ? isActive : true));
    });
    syncHeights();
  };

  nodes.forEach((node) => {
    const index = Number(node.dataset.featureIndex);
    const trigger = node.querySelector(".feature-trigger");

    node.addEventListener("mouseenter", () => {
      if (!mobileQuery.matches) setActive(index);
    });

    node.addEventListener("focusin", () => {
      if (!mobileQuery.matches) setActive(index);
    });

    trigger?.addEventListener("click", () => {
      setActive(index);
    });
  });

  mobileQuery.addEventListener("change", () => {
    requestAnimationFrame(() => setActive(activeIndex));
  });

  window.addEventListener("resize", () => {
    if (mobileQuery.matches) syncHeights();
  });

  setActive(activeIndex);
};

const initProofControls = () => {
  const track = document.querySelector("[data-proof-track]");
  const previous = document.querySelector("[data-proof-prev]");
  const next = document.querySelector("[data-proof-next]");
  if (!track || !previous || !next) return;

  const scrollAmount = () => {
    const firstCard = track.querySelector(".proof-card");
    return firstCard ? firstCard.getBoundingClientRect().width + 16 : 320;
  };

  previous.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
};

const initSearch = () => {
  const dialog = document.querySelector("[data-search-dialog]");
  const openButton = document.querySelector("[data-open-search]");
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  if (!dialog || !openButton || !input || !results) return;

  const renderResults = (query = "") => {
    const normalized = query.trim().toLowerCase();
    const matches = pageSections.filter((section) => {
      const haystack = `${section.label} ${section.terms}`.toLowerCase();
      return !normalized || haystack.includes(normalized);
    });

    results.replaceChildren(
      ...matches.map((section) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = section.href;
        link.textContent = section.label;
        link.addEventListener("click", () => dialog.close());
        item.append(link);
        return item;
      })
    );
  };

  openButton.addEventListener("click", () => {
    renderResults();
    dialog.showModal();
    requestAnimationFrame(() => input.focus());
  });

  input.addEventListener("input", (event) => {
    renderResults(event.target.value);
  });
};

const initBackToTop = () => {
  const button = document.querySelector("[data-back-to-top]");
  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 520);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
};

document.addEventListener("DOMContentLoaded", () => {
  initPricing();
  initFeatureShell();
  initProofControls();
  initSearch();
  initBackToTop();
});
