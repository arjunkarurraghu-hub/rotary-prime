// Convert an integer amount (INR) to Indian-style word form.
// e.g. 215000 -> "Two Lakh Fifteen Thousand"

const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];
const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function twoDigits(n) {
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const r = n % 10;
  return tens[t] + (r ? " " + ones[r] : "");
}

function threeDigits(n) {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  let result = "";
  if (h) result += ones[h] + " Hundred";
  if (rest) result += (h ? " " : "") + twoDigits(rest);
  return result;
}

export function amountInWords(amount) {
  amount = Math.floor(Math.abs(Number(amount) || 0));
  if (amount === 0) return "Zero";

  const crore = Math.floor(amount / 10000000);
  amount = amount % 10000000;
  const lakh = Math.floor(amount / 100000);
  amount = amount % 100000;
  const thousand = Math.floor(amount / 1000);
  amount = amount % 1000;
  const hundreds = amount;

  const parts = [];
  if (crore) parts.push(twoDigits(crore) + " Crore");
  if (lakh) parts.push(twoDigits(lakh) + " Lakh");
  if (thousand) parts.push(twoDigits(thousand) + " Thousand");
  if (hundreds) parts.push(threeDigits(hundreds));

  return parts.join(" ");
}

export function inrFormat(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}
