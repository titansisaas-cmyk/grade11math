// All content for the game. Math uses \( ... \) and is rendered with KaTeX.
const R = String.raw;


// Easy practice question helper
const E = (q, choices, hint, steps, why) => ({ easy: true, q, choices, hints: [hint], steps, why: why || steps[steps.length - 1] });

const RULES = [
  { name: "What an exponent means", rule: R`\(2^3 = 2 \times 2 \times 2 = 8\)`, plain: "The small number says how many times to multiply the big number by itself." },
  { name: "Multiplying? Add the exponents", rule: R`\(x^3 \cdot x^4 = x^{3+4} = x^7\)`, plain: "Same letter, multiplying: add the small numbers." },
  { name: "Dividing? Subtract the exponents", rule: R`\(\dfrac{x^7}{x^2} = x^{7-2} = x^5\)`, plain: "Top exponent minus bottom exponent." },
  { name: "Power of a power? Multiply", rule: R`\((x^3)^2 = x^{3 \times 2} = x^6\)`, plain: "A bracket with a power outside: multiply every exponent inside by the outside number. Numbers inside get the power too: \\((2x)^3 = 8x^3\\)." },
  { name: "Negative exponent? Flip it", rule: R`\(x^{-5} = \dfrac{1}{x^5}\)`, plain: "A negative exponent means it belongs on the other side of the fraction line. Move it and the minus goes away." },
  { name: "Zero exponent = 1", rule: R`\(x^0 = 1\)`, plain: "Anything to the power of 0 is 1." },
  { name: "Negative fraction to a power", rule: R`\(\left(\tfrac{1}{3}\right)^{-2} = 3^2 = 9\)`, plain: "Flip the fraction, then the exponent becomes positive." },
  { name: "Brackets and minus signs", rule: R`\((-3)^2 = 9 \quad \text{but} \quad -3^2 = -9\)`, plain: "If the minus is inside brackets, it gets the power. If not, it waits outside." },
  { name: "Growth or decay?", rule: R`\(y = b^x\)`, plain: "If b is bigger than 1, the graph goes up (growth). If b is between 0 and 1, it goes down (decay). Every graph like this passes through (0, 1)." },
  { name: "Doubling formula", rule: R`\(A = A_0 \cdot 2^{\,t/d}\)`, plain: "A₀ = start amount, t = time passed, d = doubling time. t and d must use the same unit." },
  { name: "Half-life formula", rule: R`\(A = A_0 \cdot \left(\tfrac{1}{2}\right)^{t/h}\)`, plain: "A₀ = start amount, t = time passed, h = half-life. Same units for t and h." },
  { name: "Percent growth formula", rule: R`\(A = A_0 (1 + r)^t\)`, plain: "r is the percent as a decimal. 8% → 0.08, so multiply by 1.08 each year." },
  { name: "Percent decay formula", rule: R`\(A = A_0 (1 - r)^t\)`, plain: "Decreasing by 2.5% → multiply by 0.975 each year." },
];

// Question format:
// { type:'lesson', title, body }   -> a short teaching card
// { q, choices:[correct, wrong, wrong, wrong], hints:[...], steps:[...], why }
// Word problems add: ctx (the story, shown on every step), stepLabel
const MISSIONS = [
  {
    id: "warmup",
    title: "Warm-up",
    badge: "0",
    sub: "What exponents mean",
    minutes: "8 min",
    items: [
      { type: "lesson", title: "An exponent is a shortcut",
        body: R`<p>The small raised number tells you how many times to multiply.</p>
        <div class="big-math">\(2^3 = 2 \times 2 \times 2 = 8\)</div>
        <p>The 2 is the <b>base</b>. The 3 is the <b>exponent</b>.</p>
        <p class="tip">It is NOT \(2 \times 3\). That is the most common mistake.</p>` },
      { q: R`What is \(2^3\)?`, choices: ["8", "6", "5", "9"],
        hints: [R`Write it out: \(2 \times 2 \times 2\).`],
        steps: [R`\(2 \times 2 = 4\)`, R`\(4 \times 2 = 8\)`], why: R`\(2 \times 2 \times 2 = 8\)` },
      { q: R`What is \(3^2\)?`, choices: ["9", "6", "8", "5"],
        hints: [R`\(3^2\) means \(3 \times 3\).`],
        steps: [R`\(3 \times 3 = 9\)`], why: R`\(3 \times 3 = 9\)` },
      E(R`What is \(4^2\)?`, ["16", "8", "6", "42"], R`\(4^2\) means \(4 \times 4\).`, [R`\(4 \times 4 = 16\)`]),
      E(R`What is \(10^3\)?`, ["1000", "30", "100", "13"], R`\(10 \times 10 \times 10\)`, [R`\(10 \times 10 = 100\)`, R`\(100 \times 10 = 1000\)`]),
      E(R`What is \(6^1\)?`, ["6", "1", "7", "0"], "An exponent of 1 means just one copy of the number.", [R`\(6^1 = 6\)`]),
      E(R`What is \(1^5\)?`, ["1", "5", "6", "15"], R`\(1 \times 1 \times 1 \times 1 \times 1\)`, ["1 times itself is always 1.", R`\(1^5 = 1\)`]),
      E(R`Write \(x \cdot x \cdot x\) as a power.`, [R`\(x^3\)`, R`\(3x\)`, R`\(x + 3\)`, R`\(x^2\)`], "Count the x's. That count is the exponent.", ["There are 3 x's.", R`\(x^3\)`]),
      { q: R`What is \(5^0\)?`, choices: ["1", "0", "5", "50"],
        hints: ["There is a special rule for the exponent 0. Check the Rules sheet."],
        steps: ["Any number (except 0) to the power of 0 equals 1.", R`\(5^0 = 1\)`], why: "Anything to the power of 0 is 1." },
      { q: R`Which one means the same as \(x^4\)?`, choices: [R`\(x \cdot x \cdot x \cdot x\)`, R`\(4x\)`, R`\(x + 4\)`, R`\(x \cdot 4\)`],
        hints: ["The exponent 4 means multiply x by itself 4 times."],
        steps: [R`\(x^4 = x \cdot x \cdot x \cdot x\)`], why: "Four x's multiplied together." },
      { type: "lesson", title: "Your calculator",
        body: R`<p>To type \(1.08^8\) on a calculator, use the power key. It looks like one of these:</p>
        <div class="keys"><span>^</span><span>x<sup>y</sup></span><span>y<sup>x</sup></span></div>
        <p>Type: <b>1.08</b> then <b>^</b> then <b>8</b> then <b>=</b></p>
        <p class="tip">For exponents that are fractions like \(\tfrac{174}{1600}\), put brackets around them: <b>0.5 ^ ( 174 ÷ 1600 )</b></p>` },
    ],
  },
  {
    id: "laws",
    title: "Mission 1A",
    badge: "1A",
    sub: "Multiply, divide, negatives (Review 1a, 1b, 1d)",
    minutes: "12 min",
    items: [
      { type: "lesson", title: "Rule 1: Multiplying? Add.",
        body: R`<p>When the same letter is multiplied, <b>add</b> the exponents.</p>
        <div class="big-math">\(x^3 \cdot x^4 = x^{3+4} = x^7\)</div>
        <p class="tip">Why? \(x^3\) is 3 x's and \(x^4\) is 4 x's. Together that's 7 x's.</p>` },
      { q: R`Simplify \(x^2 \cdot x^5\)`, choices: [R`\(x^7\)`, R`\(x^{10}\)`, R`\(x^3\)`, R`\(2x^7\)`],
        hints: ["Multiplying the same letter means ADD the exponents."], steps: [R`\(2 + 5 = 7\)`, R`\(x^7\)`], why: R`Add: \(2+5=7\).` },
      E(R`Simplify \(a^2 \cdot a^6\)`, [R`\(a^8\)`, R`\(a^{12}\)`, R`\(a^4\)`, R`\(2a^8\)`], "Multiplying: ADD the exponents.", [R`\(2 + 6 = 8\)`, R`\(a^8\)`]),
      E(R`Simplify \(y \cdot y^4\)`, [R`\(y^5\)`, R`\(y^4\)`, R`\(2y^4\)`, R`\(y^{40}\)`], R`A letter with no exponent has an invisible 1: \(y = y^1\).`, [R`\(y = y^1\)`, R`\(1 + 4 = 5\)`, R`\(y^5\)`]),
      E(R`Simplify \(x^5 \cdot x^{-2}\)`, [R`\(x^3\)`, R`\(x^7\)`, R`\(x^{-10}\)`, R`\(x^{-3}\)`], R`Add: \(5 + (-2)\). Adding a negative is the same as subtracting.`, [R`\(5 + (-2) = 5 - 2 = 3\)`, R`\(x^3\)`]),
      { q: R`Simplify \(x^3 x^4 x^{-2}\) <span class="src">Review 1a</span>`, choices: [R`\(x^5\)`, R`\(x^9\)`, R`\(x^{-24}\)`, R`\(x^{24}\)`],
        hints: ["All three are multiplied. Add all three exponents.", R`Adding a negative is like subtracting: \(3 + 4 - 2\).`],
        steps: [R`Add the exponents: \(3 + 4 + (-2)\)`, R`\(7 - 2 = 5\)`, R`Answer: \(x^5\)`], why: R`\(3+4-2=5\)` },
      E(R`Simplify \(x^2 y^3 \cdot x y\)`, [R`\(x^3 y^4\)`, R`\(x^2 y^3\)`, R`\(x^3 y^3\)`, R`\(x^7\)`], R`Do x's and y's separately. Remember \(x = x^1\) and \(y = y^1\).`, [R`x's: \(2 + 1 = 3\)`, R`y's: \(3 + 1 = 4\)`, R`\(x^3 y^4\)`]),
      { q: R`Simplify \(x^3 y^5 x^2 y^{-2}\) <span class="src">Review 1b</span>`, choices: [R`\(x^5 y^3\)`, R`\(x^5 y^7\)`, R`\(x^6 y^{-10}\)`, R`\(x^5 y^{-3}\)`],
        hints: ["Deal with each letter separately. x's together, y's together.", R`x: \(3 + 2\). y: \(5 + (-2)\).`],
        steps: [R`x's: \(x^3 \cdot x^2 = x^{5}\)`, R`y's: \(y^5 \cdot y^{-2} = y^{3}\)`, R`Answer: \(x^5 y^3\)`], why: "Each letter gets its own adding." },
      { type: "lesson", title: "Rule 2: Dividing? Subtract.",
        body: R`<p>When the same letter is divided, <b>subtract</b>: top minus bottom.</p>
        <div class="big-math">\(\dfrac{x^7}{x^2} = x^{7-2} = x^5\)</div>
        <p class="tip">If you end up with a negative exponent, flip it to the bottom: \(x^{-5} = \dfrac{1}{x^5}\)</p>` },
      { q: R`Simplify \(\dfrac{x^8}{x^3}\)`, choices: [R`\(x^5\)`, R`\(x^{11}\)`, R`\(x^{24}\)`, R`\(\dfrac{1}{x^5}\)`],
        hints: ["Dividing means SUBTRACT: top minus bottom."], steps: [R`\(8 - 3 = 5\)`, R`\(x^5\)`], why: R`\(8-3=5\)` },
      E(R`Simplify \(\dfrac{y^9}{y^4}\)`, [R`\(y^5\)`, R`\(y^{13}\)`, R`\(y^{36}\)`, R`\(y^{2}\)`], "Dividing: SUBTRACT. Top minus bottom.", [R`\(9 - 4 = 5\)`, R`\(y^5\)`]),
      E(R`Simplify \(\dfrac{m^6}{m}\)`, [R`\(m^5\)`, R`\(m^6\)`, R`\(m^7\)`, R`\(6\)`], R`The bottom m is \(m^1\).`, [R`\(6 - 1 = 5\)`, R`\(m^5\)`]),
      E(R`Simplify \(\dfrac{x^4}{x^4}\)`, ["1", R`\(x\)`, "0", R`\(x^{16}\)`], "Anything divided by itself is 1. Or: subtract the exponents.", [R`\(4 - 4 = 0\)`, R`\(x^0 = 1\)`]),
      { type: "lesson", title: "Negative exponents: flip it",
        body: R`<p>A negative exponent does <b>not</b> make the answer negative. It means the power is on the wrong side of the fraction line.</p>
        <div class="big-math">\(x^{-2} = \dfrac{1}{x^2}\)</div>
        <div class="big-math">\(\dfrac{1}{x^{-3}} = x^3\)</div>
        <p class="tip">Move it across the line and the minus sign disappears.</p>` },
      { q: R`Write \(x^{-4}\) with a positive exponent.`, choices: [R`\(\dfrac{1}{x^4}\)`, R`\(-x^4\)`, R`\(x^4\)`, R`\(\dfrac{-1}{x^4}\)`],
        hints: ["A negative exponent does NOT make the answer negative. It means: move it under 1."],
        steps: [R`Move \(x^{-4}\) to the bottom of a fraction.`, R`The minus sign on the exponent disappears: \(\dfrac{1}{x^4}\)`], why: "Negative exponent = flip to the bottom." },
      E(R`Write \(x^{-2}\) with a positive exponent.`, [R`\(\dfrac{1}{x^2}\)`, R`\(-x^2\)`, R`\(x^2\)`, R`\(-2x\)`], "Negative exponent: move it to the bottom of a fraction.", [R`\(x^{-2} = \dfrac{1}{x^2}\)`]),
      E(R`Write \(\dfrac{1}{x^{-3}}\) with a positive exponent.`, [R`\(x^3\)`, R`\(\dfrac{1}{x^3}\)`, R`\(-x^3\)`, R`\(x^{-3}\)`], "A negative exponent on the bottom moves to the top and becomes positive.", [R`Move \(x^{-3}\) to the top: \(x^3\)`]),
      E(R`Simplify \(\dfrac{x^3}{x^5}\)`, [R`\(\dfrac{1}{x^2}\)`, R`\(x^2\)`, R`\(x^8\)`, R`\(x^{15}\)`], R`Subtract: \(3 - 5\). If it's negative, flip it.`, [R`\(3 - 5 = -2\)`, R`\(x^{-2} = \dfrac{1}{x^2}\)`]),
      { q: R`Simplify \(\dfrac{x^2 x^{-3}}{x^4}\) <span class="src">Review 1d</span>`, choices: [R`\(\dfrac{1}{x^5}\)`, R`\(x^5\)`, R`\(x^{-1}\)`, R`\(\dfrac{1}{x^{3}}\)`],
        hints: [R`Do the top first: \(x^2 \cdot x^{-3}\). Add: \(2 + (-3)\).`, R`The top becomes \(x^{-1}\). Now divide: \(-1 - 4\).`],
        steps: [R`Top: \(2 + (-3) = -1\), so \(x^{-1}\)`, R`Divide: \(-1 - 4 = -5\), so \(x^{-5}\)`, R`Make it positive: \(\dfrac{1}{x^5}\)`], why: R`Top \(= x^{-1}\), then \(-1-4=-5\), then flip.` },
    ],
  },
  {
    id: "laws2",
    title: "Mission 1B",
    badge: "1B",
    sub: "Brackets and mixed rules (Review 1c, 1e–1i)",
    minutes: "15 min",
    items: [
      { type: "lesson", title: "Rule 3: Bracket with a power? Multiply.",
        body: R`<p>When a bracket has a power outside, <b>multiply</b> every exponent inside by it.</p>
        <div class="big-math">\((x^3)^2 = x^{3 \times 2} = x^6\)</div>
        <p class="tip">Plain numbers inside get the power too: \((2x^3)^3 = 2^3 x^9 = 8x^9\)</p>` },
      { q: R`Simplify \((x^4)^3\)`, choices: [R`\(x^{12}\)`, R`\(x^7\)`, R`\(x^{64}\)`, R`\(3x^4\)`],
        hints: ["A power outside a bracket means MULTIPLY the exponents."], steps: [R`\(4 \times 3 = 12\)`, R`\(x^{12}\)`], why: R`\(4 \times 3 = 12\)` },
      E(R`Simplify \((y^2)^5\)`, [R`\(y^{10}\)`, R`\(y^7\)`, R`\(y^{25}\)`, R`\(5y^2\)`], "Bracket with a power outside: MULTIPLY the exponents.", [R`\(2 \times 5 = 10\)`, R`\(y^{10}\)`]),
      E(R`Simplify \((3x)^2\)`, [R`\(9x^2\)`, R`\(3x^2\)`, R`\(6x^2\)`, R`\(9x\)`], R`Both the 3 and the x get squared.`, [R`\(3^2 = 9\)`, R`\(x^2\)`, R`\(9x^2\)`]),
      E(R`Simplify \((2x^2)^3\)`, [R`\(8x^6\)`, R`\(2x^6\)`, R`\(6x^6\)`, R`\(8x^5\)`], R`Cube the 2: \(2^3\). Multiply the x exponent: \(2 \times 3\).`, [R`\(2^3 = 8\)`, R`\(x^{2 \times 3} = x^6\)`, R`\(8x^6\)`]),
      { q: R`Simplify \(2(2x^3)^3\) <span class="src">Review 1c</span>`, choices: [R`\(16x^9\)`, R`\(8x^9\)`, R`\(16x^6\)`, R`\(12x^9\)`],
        hints: [R`First do only the bracket: \((2x^3)^3\). The 2 inside gets cubed too.`, R`\((2x^3)^3 = 2^3 \cdot x^{9} = 8x^9\). Now multiply by the 2 out front.`],
        steps: [R`Bracket: \(2^3 = 8\) and \(x^{3 \times 3} = x^9\), so \(8x^9\)`, R`Multiply by the front 2: \(2 \times 8x^9 = 16x^9\)`], why: R`\(2 \times 8x^9 = 16x^9\)` },
      E(R`Simplify \((x^{-2})^3\)`, [R`\(\dfrac{1}{x^6}\)`, R`\(x^6\)`, R`\(x^{1}\)`, R`\(\dfrac{1}{x^5}\)`], R`Multiply: \(-2 \times 3\). Then flip.`, [R`\(-2 \times 3 = -6\)`, R`\(x^{-6} = \dfrac{1}{x^6}\)`]),
      E(R`Simplify \((m^6)^{-2}\)`, [R`\(\dfrac{1}{m^{12}}\)`, R`\(m^{12}\)`, R`\(m^4\)`, R`\(\dfrac{1}{m^4}\)`], R`Multiply: \(6 \times (-2)\). Then flip.`, [R`\(6 \times (-2) = -12\)`, R`\(m^{-12} = \dfrac{1}{m^{12}}\)`]),
      E(R`Simplify \(\dfrac{m^2}{m^{-4}}\)`, [R`\(m^6\)`, R`\(m^{-2}\)`, R`\(m^{-8}\)`, R`\(m^2\)`], R`Subtract: \(2 - (-4)\). Two minuses make a plus.`, [R`\(2 - (-4) = 2 + 4 = 6\)`, R`\(m^6\)`]),
      { q: R`Simplify \(\left(\dfrac{m^2}{m^{-4}}\right)^{-2}\) <span class="src">Review 1e</span>`, choices: [R`\(\dfrac{1}{m^{12}}\)`, R`\(m^{12}\)`, R`\(\dfrac{1}{m^{4}}\)`, R`\(m^{-4}\)`],
        hints: [R`Inside first: divide means subtract. \(2 - (-4)\). Two minuses make a plus.`, R`Inside is \(m^6\). Now the power outside: \(6 \times (-2)\).`],
        steps: [R`Inside: \(2 - (-4) = 2 + 4 = 6\), so \(m^6\)`, R`Outside power: \(6 \times (-2) = -12\), so \(m^{-12}\)`, R`Flip: \(\dfrac{1}{m^{12}}\)`], why: R`Inside \(m^6\), then \(6 \times -2 = -12\), then flip.` },
      E(R`Simplify \(\dfrac{b^2 \cdot b^3}{b}\)`, [R`\(b^4\)`, R`\(b^5\)`, R`\(b^6\)`, R`\(b^{2}\)`], R`Top first: \(2 + 3\). Then subtract the bottom 1.`, [R`Top: \(b^5\)`, R`\(5 - 1 = 4\)`, R`\(b^4\)`]),
      E(R`Simplify \(c^2 \cdot c^{-3}\)`, [R`\(c^{-1}\)`, R`\(c^{5}\)`, R`\(c^{-6}\)`, R`\(c^{1}\)`], R`Add: \(2 + (-3)\).`, [R`\(2 - 3 = -1\)`, R`\(c^{-1}\)`]),
      { q: R`Simplify \(\dfrac{b^2}{c^2 b} \times \dfrac{b^3}{c^{-3}}\) <span class="src">Review 1f</span>`, choices: [R`\(b^4 c\)`, R`\(\dfrac{b^4}{c^5}\)`, R`\(b^5 c\)`, R`\(\dfrac{b^6}{c}\)`],
        hints: [R`Make one big fraction. Top: \(b^2 \cdot b^3\). Bottom: \(c^2 \cdot b \cdot c^{-3}\).`, R`Top \(= b^5\). Bottom \(= b \cdot c^{-1}\). Remember a lone \(b\) is \(b^1\).`],
        steps: [R`Top: \(b^2 \cdot b^3 = b^5\)`, R`Bottom: \(b \cdot c^{2 + (-3)} = b \cdot c^{-1}\)`, R`b's: \(5 - 1 = 4\), so \(b^4\)`, R`\(c^{-1}\) on the bottom moves to the top as \(c^1\)`, R`Answer: \(b^4 c\)`], why: R`\(\dfrac{b^5}{b\,c^{-1}} = b^4 c\)` },
      E(R`Simplify \(\left(\dfrac{v^6}{v^2}\right)^2\)`, [R`\(v^8\)`, R`\(v^6\)`, R`\(v^{16}\)`, R`\(v^{4}\)`], R`Inside first: \(6 - 2\). Then multiply by the outside 2.`, [R`Inside: \(v^4\)`, R`\(4 \times 2 = 8\)`, R`\(v^8\)`]),
      { q: R`Simplify \(\left(\dfrac{v^2 v^3 v^5}{v^3}\right)^4\) <span class="src">Review 1i</span>`, choices: [R`\(v^{28}\)`, R`\(v^{11}\)`, R`\(v^{40}\)`, R`\(v^{7}\)`],
        hints: [R`Inside top: \(2+3+5\). Then subtract the bottom 3.`, R`Inside is \(v^7\). Now multiply by the outside 4.`],
        steps: [R`Top: \(2 + 3 + 5 = 10\), so \(v^{10}\)`, R`Divide: \(10 - 3 = 7\), so \(v^7\)`, R`Power: \(7 \times 4 = 28\)`, R`Answer: \(v^{28}\)`], why: R`\(v^7\) then \(7 \times 4 = 28\).` },
      E(R`Simplify \(\left(\dfrac{x^2}{y^3}\right)^2\)`, [R`\(\dfrac{x^4}{y^6}\)`, R`\(\dfrac{x^4}{y^5}\)`, R`\(\dfrac{x^2}{y^6}\)`, R`\(\dfrac{x^{4}}{y^{3}}\)`], "Multiply every exponent inside by the outside 2 — top AND bottom.", [R`Top: \(2 \times 2 = 4\)`, R`Bottom: \(3 \times 2 = 6\)`, R`\(\dfrac{x^4}{y^6}\)`]),
      E(R`Simplify \(\left(\dfrac{x}{y^2}\right)^{-1}\)`, [R`\(\dfrac{y^2}{x}\)`, R`\(\dfrac{x}{y^2}\)`, R`\(-\dfrac{x}{y^2}\)`, R`\(\dfrac{y}{x^2}\)`], "A power of −1 on a fraction just flips the fraction.", ["Flip it upside down.", R`\(\dfrac{y^2}{x}\)`]),
      E(R`Simplify \(d^{6} \cdot d^{-6}\)`, ["1", R`\(d^{12}\)`, R`\(d^{-36}\)`, "0"], R`Add: \(6 + (-6)\).`, [R`\(6 - 6 = 0\)`, R`\(d^0 = 1\)`]),
      { q: R`Simplify \(\left(\dfrac{c^2}{d^3}\right)^{-2}\left(\dfrac{c^{-3}}{d^2}\right)^{3}\) <span class="src">Review 1g</span>`, choices: [R`\(\dfrac{1}{c^{13}}\)`, R`\(c^{13}\)`, R`\(\dfrac{1}{c^{13}d^{12}}\)`, R`\(\dfrac{d^{12}}{c^{13}}\)`],
        hints: [R`Do each bracket separately. Multiply each exponent by the outside power.`, R`First bracket: \(c^{-4}\) over \(d^{-6}\). Second: \(c^{-9}\) over \(d^{6}\).`, R`c's: \(-4 + (-9)\). d's: the \(d^{-6}\) on the bottom is \(d^{6}\) on top, and the \(d^6\) on the bottom cancels it.`],
        steps: [R`First: \(\dfrac{c^{2 \times -2}}{d^{3 \times -2}} = \dfrac{c^{-4}}{d^{-6}}\)`, R`Second: \(\dfrac{c^{-3 \times 3}}{d^{2 \times 3}} = \dfrac{c^{-9}}{d^{6}}\)`, R`c's: \(-4 + (-9) = -13\)`, R`d's: \(d^{6}\) on top and \(d^{6}\) on the bottom cancel, so \(d^0 = 1\)`, R`Answer: \(c^{-13} = \dfrac{1}{c^{13}}\)`], why: R`The d's cancel. c's: \(-4-9=-13\).` },
      { q: R`Simplify \(\left(\dfrac{g^2 g^3}{h^{-1}}\right)^{-3}\left(\dfrac{h^3}{i^2}\right)^{2}\) <span class="src">Review 1h</span>`, choices: [R`\(\dfrac{h^3}{g^{15} i^4}\)`, R`\(\dfrac{g^{15}h^3}{i^4}\)`, R`\(\dfrac{h^9}{g^{15} i^4}\)`, R`\(\dfrac{h^3}{g^{5} i^4}\)`],
        hints: [R`First bracket inside: \(g^2 g^3 = g^5\). And \(h^{-1}\) on the bottom = \(h^1\) on top. So it is \((g^5 h)^{-3}\).`, R`\((g^5 h)^{-3} = g^{-15} h^{-3}\). Second bracket: \(h^6 i^{-4}\).`, R`h's: \(-3 + 6 = 3\).`],
        steps: [R`First bracket inside: \(g^5 h^1\)`, R`Power \(-3\): \(g^{-15} h^{-3}\)`, R`Second bracket: \(h^{6} i^{-4}\)`, R`h's: \(-3 + 6 = 3\), so \(h^3\)`, R`Negatives go to the bottom: \(\dfrac{h^3}{g^{15} i^4}\)`], why: R`\(g^{-15}h^{3}i^{-4}\), then move the negatives down.` },
    ],
  },
  {
    id: "evaluate",
    title: "Mission 2",
    badge: "2",
    sub: "Find the number (Question 2 on the review)",
    minutes: "15 min",
    items: [
      { type: "lesson", title: "Watch the minus signs",
        body: R`<div class="big-math">\((-3)^2 = (-3)(-3) = 9\)</div>
        <div class="big-math">\(-3^2 = -(3 \cdot 3) = -9\)</div>
        <p>If the minus is <b>inside brackets</b>, it gets multiplied. If it is <b>outside</b>, it waits until the end.</p>
        <p class="tip">Negative × negative = positive. Three negatives multiplied = negative.</p>` },
      E(R`Evaluate \(3^3\)`, ["27", "9", "6", "33"], R`\(3 \times 3 \times 3\)`, [R`\(3 \times 3 = 9\)`, R`\(9 \times 3 = 27\)`]),
      E(R`Evaluate \(5^2\)`, ["25", "10", "7", "52"], R`\(5 \times 5\)`, [R`\(5 \times 5 = 25\)`]),
      { q: R`Evaluate \(2^4\) <span class="src">Review 2a</span>`, choices: ["16", "8", "6", "32"],
        hints: [R`\(2 \times 2 \times 2 \times 2\)`], steps: [R`\(2 \times 2 = 4\)`, R`\(4 \times 2 = 8\)`, R`\(8 \times 2 = 16\)`], why: R`Four 2's multiplied = 16` },
      E(R`Evaluate \((-2)^2\)`, ["4", "−4", "−2", "0"], R`\((-2) \times (-2)\). Negative times negative is positive.`, [R`\((-2)(-2) = 4\)`]),
      E(R`Evaluate \(-2^2\)`, ["−4", "4", "−2", "2"], "No brackets, so the minus waits outside. Square the 2 first.", [R`\(2^2 = 4\)`, R`Put the minus back: \(-4\)`]),
      E(R`Evaluate \((-2)^3\)`, ["−8", "8", "−6", "6"], R`\((-2)(-2)(-2)\)`, [R`\((-2)(-2) = 4\)`, R`\(4 \times (-2) = -8\)`]),
      { q: R`Evaluate \((-3)^3\) <span class="src">Review 2b</span>`, choices: ["−27", "27", "−9", "9"],
        hints: [R`The minus is inside the bracket, so multiply \((-3)(-3)(-3)\).`, "Neg × neg = pos. Then pos × neg = neg."],
        steps: [R`\((-3)(-3) = 9\)`, R`\(9 \times (-3) = -27\)`], why: "Three negatives multiplied = negative." },
      E(R`Evaluate \(2^{-1}\)`, [R`\(\tfrac{1}{2}\)`, "−2", "2", R`\(-\tfrac{1}{2}\)`], "Negative exponent: put it under 1.", [R`\(2^{-1} = \dfrac{1}{2^1} = \dfrac{1}{2}\)`]),
      E(R`Evaluate \(3^{-2}\)`, [R`\(\tfrac{1}{9}\)`, "−9", "−6", R`\(\tfrac{1}{6}\)`], R`\(3^{-2} = \dfrac{1}{3^2}\)`, [R`\(\dfrac{1}{3^2}\)`, R`\(3^2 = 9\)`, R`\(\dfrac{1}{9}\)`]),
      { q: R`Evaluate \(2^{-3}\) <span class="src">Review 2c</span>`, choices: [R`\(\tfrac{1}{8}\)`, "−8", "−6", R`\(\tfrac{1}{6}\)`],
        hints: ["Negative exponent means flip it under 1. It does NOT make it negative."],
        steps: [R`\(2^{-3} = \dfrac{1}{2^3}\)`, R`\(2^3 = 8\)`, R`Answer: \(\dfrac{1}{8}\)`], why: R`\(\dfrac{1}{2^3} = \dfrac{1}{8}\)` },
      E(R`Evaluate \(-(-5)\)`, ["5", "−5", "0", "−10"], "A minus in front of a negative makes it positive.", [R`\(-(-5) = 5\)`]),
      E(R`Evaluate \(-(-2)^3\)`, ["8", "−8", "6", "−6"], R`Bracket first: \((-2)^3 = -8\). Then the front minus.`, [R`\((-2)^3 = -8\)`, R`\(-(-8) = 8\)`]),
      { q: R`Evaluate \(-(-3)^3\) <span class="src">Review 2d</span>`, choices: ["27", "−27", "9", "−9"],
        hints: [R`Do the bracket first: \((-3)^3 = -27\).`, R`Now the minus out front: \(-(-27)\).`],
        steps: [R`\((-3)^3 = -27\)`, R`\(-(-27) = 27\)`], why: "Minus of a minus = plus." },
      E(R`Evaluate \(\left(\tfrac{1}{2}\right)^{-1}\)`, ["2", R`\(\tfrac{1}{2}\)`, "−2", R`\(-\tfrac{1}{2}\)`], "Power of −1 on a fraction: flip it.", [R`Flip \(\tfrac{1}{2}\) to get 2.`]),
      E(R`Evaluate \(\left(\tfrac{1}{2}\right)^{-3}\)`, ["8", R`\(\tfrac{1}{8}\)`, "−8", "6"], R`Flip to 2, then \(2^3\).`, [R`Flip: \(2^3\)`, R`\(2^3 = 8\)`]),
      { q: R`Evaluate \(\left(\tfrac{1}{3}\right)^{-2}\) <span class="src">Review 2e</span>`, choices: ["9", R`\(\tfrac{1}{9}\)`, "−9", R`\(-\tfrac{2}{3}\)`],
        hints: ["Negative exponent on a fraction: flip the fraction. 1/3 becomes 3."],
        steps: [R`Flip: \(\left(\tfrac{1}{3}\right)^{-2} = 3^2\)`, R`\(3^2 = 9\)`], why: R`Flip, then \(3^2 = 9\).` },
      E(R`Evaluate \(-3^2\)`, ["−9", "9", "−6", "6"], "No brackets around −3, so square the 3 first, then put the minus back.", [R`\(3^2 = 9\)`, R`\(-9\)`]),
      E(R`Evaluate \((-2^2)^3\)`, ["−64", "64", "−12", "12"], R`Inside: \(-2^2 = -4\). Then \((-4)^3\).`, [R`\(-2^2 = -4\)`, R`\((-4)^3 = (-4)(-4)(-4) = -64\)`]),
      { q: R`Evaluate \(-(-3^2)^3\) <span class="src">Review 2f</span>`, choices: ["729", "−729", "216", "−216"],
        hints: [R`Inside the bracket: \(-3^2\). The minus is NOT in brackets with the 3, so it's \(-(3^2) = -9\).`, R`Now \((-9)^3 = -729\). Then the front minus.`],
        steps: [R`\(-3^2 = -9\)`, R`\((-9)^3 = -729\)`, R`\(-(-729) = 729\)`], why: R`\(-(-729) = 729\)` },
    ],
  },
  {
    id: "graphs",
    title: "Mission 3",
    badge: "3",
    sub: "Tables and graphs (Question 3 on the review)",
    minutes: "12 min",
    items: [
      { type: "lesson", title: "Making a table of values",
        body: R`<p>For \(y = 2^x\), put each x into the calculator.</p>
        <table class="tov"><tr><th>x</th><td>−3</td><td>−2</td><td>−1</td><td>0</td><td>1</td><td>2</td><td>3</td></tr>
        <tr><th>y</th><td>0.125</td><td>0.25</td><td>0.5</td><td>1</td><td>2</td><td>4</td><td>8</td></tr></table>
        <p>Each step to the right, y is <b>multiplied by 2</b>.</p>
        <p class="tip">When x = 0, y is always 1. Every graph like this goes through (0, 1).</p>` },
      E(R`For \(y = 2^x\), what is y when \(x = 1\)?`, ["2", "1", "0", "3"], R`Work out \(2^1\).`, [R`\(2^1 = 2\)`]),
      E(R`For \(y = 2^x\), what is y when \(x = 2\)?`, ["4", "2", "6", "8"], R`Work out \(2^2 = 2 \times 2\).`, [R`\(2^2 = 4\)`]),
      { q: R`For \(y = 2^x\), what is y when \(x = 3\)?`, choices: ["8", "6", "9", "5"],
        hints: [R`Work out \(2^3\).`], steps: [R`\(2^3 = 2 \times 2 \times 2 = 8\)`], why: R`\(2^3 = 8\)` },
      E(R`For \(y = 2^x\), what is y when \(x = -1\)?`, ["0.5", "−2", "−0.5", "2"], R`\(2^{-1} = \dfrac{1}{2}\)`, [R`\(2^{-1} = \dfrac{1}{2} = 0.5\)`]),
      { q: R`For \(y = 2^x\), what is y when \(x = -2\)?`, choices: ["0.25", "−4", "−0.25", "4"],
        hints: [R`\(2^{-2} = \dfrac{1}{2^2}\)`], steps: [R`\(2^{-2} = \dfrac{1}{4}\)`, R`\(\dfrac{1}{4} = 0.25\)`], why: R`\(\tfrac{1}{4} = 0.25\)` },
      E(R`For \(y = 0.5^x\), what is y when \(x = 1\)?`, ["0.5", "1", "0", "5"], R`\(0.5^1\) is just 0.5.`, [R`\(0.5^1 = 0.5\)`]),
      E(R`For \(y = 0.5^x\), what is y when \(x = -1\)?`, ["2", "−0.5", "0.5", "−2"], R`\(0.5 = \tfrac{1}{2}\). A power of −1 flips it.`, [R`\(\left(\tfrac{1}{2}\right)^{-1} = 2\)`]),
      { q: R`For \(y = 0.5^x\), what is y when \(x = -3\)?`, choices: ["8", "0.125", "−1.5", "−8"],
        hints: [R`\(0.5\) is the same as \(\tfrac{1}{2}\). A negative exponent flips it to 2.`],
        steps: [R`\(0.5^{-3} = \left(\tfrac{1}{2}\right)^{-3} = 2^3\)`, R`\(2^3 = 8\)`], why: R`Flip \(\tfrac12\) to 2, then \(2^3 = 8\).` },
      { q: R`For \(y = 1.5^x\), what is y when \(x = 2\)?`, choices: ["2.25", "3", "3.375", "1.5"],
        hints: [R`\(1.5 \times 1.5\)`], steps: [R`\(1.5 \times 1.5 = 2.25\)`], why: R`\(1.5^2 = 2.25\)` },
      { q: R`What is y when \(x = 0\) for ANY of these: \(2^x\), \(0.5^x\), \(1.5^x\)?`, choices: ["1", "0", "The base number", "It depends"],
        hints: ["Zero exponent rule."], steps: ["Anything to the power 0 is 1.", "So every one of these graphs crosses the y-axis at 1."], why: "Power of 0 = 1." },
      E(R`Is \(y = 3^x\) growth or decay?`, ["Growth", "Decay", "Neither", "Both"], "Is 3 bigger than 1?", ["3 is bigger than 1, so it is growth."]),
      E(R`Is \(y = 0.25^x\) growth or decay?`, ["Decay", "Growth", "Neither", "Both"], "Is 0.25 bigger or smaller than 1?", ["0.25 is between 0 and 1, so it is decay."]),
      { q: R`Which graph is \(y = 2^x\)?`, graphChoices: true, choices: ["g:2", "g:0.5", "g:lin", "g:1.5d"],
        hints: ["2 is bigger than 1, so it is growth. The graph goes UP to the right.", "It must pass through (0, 1) and (1, 2)."],
        steps: ["Base 2 is bigger than 1 → growth → curve goes up to the right.", "It hits (0, 1), then (1, 2), (2, 4), (3, 8)."], why: "Curves up, through (0, 1)." },
      { q: R`Which graph is \(y = 0.5^x\)?`, graphChoices: true, choices: ["g:0.5", "g:2", "g:lin", "g:1.5"],
        hints: ["0.5 is less than 1, so it is decay. The graph goes DOWN to the right."],
        steps: ["Base 0.5 is between 0 and 1 → decay.", "High on the left (8 at x = −3), down to 1 at x = 0, then close to 0."], why: "Curves down, through (0, 1)." },
      { q: R`Is \(y = 1.5^x\) growth or decay?`, choices: ["Growth", "Decay", "Neither", "Both"],
        hints: ["Is 1.5 bigger than 1 or smaller than 1?"], steps: ["1.5 is bigger than 1.", "Bigger than 1 → growth."], why: "Base above 1 = growth." },
      { q: R`In the table for \(y = 1.5^x\), each time x goes up by 1, y is…`, choices: ["multiplied by 1.5", "plus 1.5", "multiplied by 2", "plus 0.5"],
        hints: [R`Look: 1 → 1.5 → 2.25 → 3.375. What do you multiply by?`], steps: [R`\(1 \times 1.5 = 1.5\)`, R`\(1.5 \times 1.5 = 2.25\)`, "The base is the number you multiply by each step."], why: "The base is the multiplier." },
      { q: R`Does the graph of \(y = 2^x\) ever touch the x-axis?`, choices: ["No, it gets close but never touches", "Yes, at x = −3", "Yes, at x = 0", "Yes, at x = −1"],
        hints: [R`At x = −3, y = 0.125. At x = −10, y is tiny but still above 0.`], steps: ["You can keep halving forever and never reach 0.", "So y stays above 0."], why: "y is always above 0." },
    ],
  },
  {
    id: "words",
    title: "Mission 4A",
    badge: "4A",
    sub: "Skills check + word problems 1–3 (doubling)",
    minutes: "15 min",
    items: [
      { type: "lesson", title: "Pick the right formula",
        body: R`<p>Look for the key word. It tells you which formula to use.</p>
        <div class="formula-grid">
          <div><b>"doubles" / "divides"</b>\(A = A_0 \cdot 2^{\,t/d}\)</div>
          <div><b>"half-life"</b>\(A = A_0 \cdot \left(\tfrac12\right)^{t/h}\)</div>
          <div><b>"increases by __%"</b>, interest\(A = A_0 (1 + r)^t\)</div>
          <div><b>"decreases by __%"</b>\(A = A_0 (1 - r)^t\)</div>
        </div>
        <p class="tip">\(A_0\) = how much you started with. Percent → decimal: 8% = 0.08.</p>` },
      // WP1
      { type: "lesson", title: "Skills check first",
        body: R`<p>Before the word problems, a few quick skills you will use in them.</p>
        <p class="tip">Percent to decimal: move the decimal point 2 places left. 8% → 0.08</p>` },
      E("Write 8% as a decimal.", ["0.08", "0.8", "8.0", "0.008"], "Move the decimal point 2 places to the left.", ["8 → 0.08"]),
      E("Write 25% as a decimal.", ["0.25", "2.5", "0.025", "25"], "Move the decimal point 2 places to the left.", ["25 → 0.25"]),
      E("Something grows by 10% each year. What do you multiply by?", ["1.10", "0.10", "0.90", "10"], "Growing: 1 + the decimal.", ["10% → 0.10", R`\(1 + 0.10 = 1.10\)`]),
      E("Something shrinks by 10% each year. What do you multiply by?", ["0.90", "1.10", "0.10", "−10"], "Shrinking: 1 − the decimal.", ["10% → 0.10", R`\(1 - 0.10 = 0.90\)`]),
      E("How many minutes are in 2 hours?", ["120", "60", "200", "100"], R`\(2 \times 60\)`, [R`\(2 \times 60 = 120\)`]),
      E("You start with 5. It doubles 3 times. How many now?", ["40", "15", "30", "20"], "Double it 3 times: 5 → 10 → …", ["5 → 10 → 20 → 40"]),
      E("Start at 100%. Cut it in half 2 times. What % is left?", ["25%", "50%", "12.5%", "0%"], "100 → 50 → …", ["100 → 50 → 25"]),
      E("A question says 'half-life'. Which formula?", [R`\(A = A_0 \cdot \left(\tfrac12\right)^{t/h}\)`, R`\(A = A_0 \cdot 2^{\,t/d}\)`, R`\(A = A_0(1+r)^t\)`, R`\(A = A_0(1-r)^t\)`], "Half-life means it gets cut in half. Look for the ½.", ["Half-life → the formula with ½."]),
      E("A question says 'increases by 5% per year'. Which formula?", [R`\(A = A_0(1+r)^t\)`, R`\(A = A_0(1-r)^t\)`, R`\(A = A_0 \cdot 2^{\,t/d}\)`, R`\(A = A_0 \cdot \left(\tfrac12\right)^{t/h}\)`], "Increases → plus.", ["Increases by a percent → \\(1 + r\\)."]),
      { ctx: R`A strain of E. coli divides every 5 minutes. If 10 bacteria are present to start, how many are there after 2 hours? <span class="src">Word problem 1</span>`, stepLabel: "Step 1 of 3",
        q: "Which formula?", choices: [R`\(A = A_0 \cdot 2^{\,t/d}\)`, R`\(A = A_0 \cdot \left(\tfrac12\right)^{t/h}\)`, R`\(A = A_0(1+r)^t\)`, R`\(A = A_0(1-r)^t\)`],
        hints: ["'Divides' means each one splits into 2. That is doubling."], steps: ["Divides = doubles → doubling formula."], why: "Divides = doubles." },
      { ctx: R`E. coli divides every 5 minutes. Start: 10. Time: 2 hours.`, stepLabel: "Step 2 of 3",
        q: R`How many times does it double? (\(t \div d\))`, choices: ["24", "0.4", "10", "12"],
        hints: ["Same units! Change 2 hours into minutes first.", R`2 hours = 120 minutes. \(120 \div 5\).`], steps: ["2 hours = 120 minutes", R`\(120 \div 5 = 24\) doublings`], why: R`\(120 \div 5 = 24\)` },
      { ctx: R`E. coli divides every 5 minutes. Start: 10. Doubles 24 times.`, stepLabel: "Step 3 of 3",
        q: R`Work out \(10 \cdot 2^{24}\)`, choices: ["167 772 160", "480", "16 777 216", "335 544 320"],
        hints: ["Calculator: 2 ^ 24 = 16 777 216. Then times 10."], steps: [R`\(2^{24} = 16\,777\,216\)`, R`\(\times 10 = 167\,772\,160\)`], why: "Answer: 167 772 160 bacteria." },
      // WP2
      { ctx: R`2 bacteria are placed in a tube. After one hour, 512 bacteria are present. What is the doubling time in minutes? <span class="src">Word problem 2</span>`, stepLabel: "Step 1 of 3",
        q: "How many times bigger did it get?", choices: ["256", "510", "514", "1024"],
        hints: [R`Divide: \(512 \div 2\).`], steps: [R`\(512 \div 2 = 256\)`], why: "It grew 256 times bigger." },
      { ctx: R`2 bacteria grew to 512 in one hour. That is 256 times bigger.`, stepLabel: "Step 2 of 3",
        q: R`\(2^{?} = 256\). How many doublings?`, choices: ["8", "128", "16", "7"],
        hints: ["Keep doubling: 2, 4, 8, 16, 32, 64, 128, 256. Count them."], steps: ["2, 4, 8, 16, 32, 64, 128, 256 — that's 8 numbers.", R`\(2^8 = 256\)`], why: R`\(2^8 = 256\)` },
      { ctx: R`8 doublings happened in 1 hour (60 minutes).`, stepLabel: "Step 3 of 3",
        q: "What is the doubling time?", choices: ["7.5 minutes", "8 minutes", "480 minutes", "0.13 minutes"],
        hints: [R`Split 60 minutes into 8 equal parts: \(60 \div 8\).`], steps: [R`\(60 \div 8 = 7.5\)`], why: "Answer: 7.5 minutes." },
      // WP3
      { ctx: R`A culture of cells doubles every 30 minutes. After 3 hours, there are 64 000 bacteria. How many were in the original culture? <span class="src">Word problem 3</span>`, stepLabel: "Step 1 of 3",
        q: "How many doublings in 3 hours?", choices: ["6", "10", "90", "3"],
        hints: [R`3 hours = 180 minutes. \(180 \div 30\).`], steps: ["3 hours = 180 minutes", R`\(180 \div 30 = 6\)`], why: "6 doublings." },
      { ctx: R`Doubles 6 times. Ends at 64 000.`, stepLabel: "Step 2 of 3",
        q: R`What is \(2^6\)?`, choices: ["64", "12", "32", "36"],
        hints: ["2, 4, 8, 16, 32, 64"], steps: [R`\(2^6 = 64\)`], why: R`\(2^6 = 64\)` },
      { ctx: R`\(A_0 \cdot 64 = 64\,000\)`, stepLabel: "Step 3 of 3",
        q: R`What is \(A_0\) (the start)?`, choices: ["1000", "4 096 000", "100", "64"],
        hints: ["Going backwards: divide instead of multiply.", R`\(64\,000 \div 64\)`], steps: [R`\(64\,000 \div 64 = 1000\)`], why: "Answer: 1000 bacteria." },
    ],
  },
  {
    id: "words2",
    title: "Mission 4B",
    badge: "4B",
    sub: "Word problems 4–9: money, half-life, percent",
    minutes: "15 min",
    items: [
      { type: "lesson", title: "Quick reminder",
        body: R`<div class="formula-grid">
          <div><b>"increases by __%"</b>, interest\(A = A_0 (1 + r)^t\)</div>
          <div><b>"decreases by __%"</b>\(A = A_0 (1 - r)^t\)</div>
          <div><b>"half-life"</b>\(A = A_0 \cdot \left(\tfrac12\right)^{t/h}\)</div>
          <div><b>"doubles"</b>\(A = A_0 \cdot 2^{\,t/d}\)</div>
        </div>
        <p class="tip">Percent → decimal: move the decimal 2 places left.</p>` },
      // WP4
      { ctx: R`Calculate the final amount of an investment of $1000 at 8% interest, compounded yearly, after 8 years. <span class="src">Word problem 4</span>`, stepLabel: "Step 1 of 2",
        q: "What do you multiply by each year?", choices: ["1.08", "0.08", "8", "0.92"],
        hints: ["8% = 0.08. Growing means 1 + 0.08."], steps: ["8% → 0.08", R`Growth: \(1 + 0.08 = 1.08\)`], why: "Keep 100% and add 8% = 108% = 1.08" },
      { ctx: R`$1000, multiply by 1.08 each year, for 8 years.`, stepLabel: "Step 2 of 2",
        q: R`Work out \(1000(1.08)^8\)`, choices: ["$1850.93", "$1640.00", "$1080.00", "$8640.00"],
        hints: ["Calculator: 1.08 ^ 8 = 1.85093… then × 1000."], steps: [R`\(1.08^8 \approx 1.85093\)`, R`\(\times 1000 = 1850.93\)`], why: "Answer: $1850.93" },
      // WP5
      { ctx: R`College tuition increases 5.2% per year. It is $4800 now. What will it be in 5 years? <span class="src">Word problem 5</span>`, stepLabel: "Step 1 of 2",
        q: "What do you multiply by each year?", choices: ["1.052", "1.52", "0.052", "5.2"],
        hints: ["5.2% as a decimal: move the decimal 2 places left → 0.052."], steps: ["5.2% → 0.052", R`\(1 + 0.052 = 1.052\)`], why: "1.052" },
      { ctx: R`$4800, multiply by 1.052 each year, for 5 years.`, stepLabel: "Step 2 of 2",
        q: R`Work out \(4800(1.052)^5\)`, choices: ["$6184.72", "$6048.00", "$5049.60", "$37 704.53"],
        hints: ["Calculator: 1.052 ^ 5 then × 4800."], steps: [R`\(1.052^5 \approx 1.28848\)`, R`\(\times 4800 \approx 6184.72\)`], why: "Answer: $6184.72" },
      // WP6
      { ctx: R`In 1976, a hospital bought half a gram (0.5 g) of radium. How much will be left in 2150? The half-life of radium is 1600 years. <span class="src">Word problem 6</span>`, stepLabel: "Step 1 of 2",
        q: "How many years pass?", choices: ["174", "1600", "4126", "2150"],
        hints: [R`\(2150 - 1976\)`], steps: [R`\(2150 - 1976 = 174\) years`], why: "174 years." },
      { ctx: R`Start 0.5 g. Half-life 1600 years. Time 174 years.`, stepLabel: "Step 2 of 2",
        q: R`Work out \(0.5 \cdot \left(\tfrac12\right)^{174/1600}\)`, choices: ["0.46 g", "0.25 g", "0.05 g", "0.50 g"],
        hints: ["Calculator: 0.5 ^ ( 174 ÷ 1600 ) — brackets matter!", "That gives about 0.927. Then × 0.5."], steps: [R`\(174 \div 1600 = 0.10875\)`, R`\(0.5^{0.10875} \approx 0.927\)`, R`\(0.5 \times 0.927 \approx 0.46\) g`], why: "Answer: about 0.46 g. Not much time has passed compared to the half-life, so most is left." },
      // WP7
      { ctx: R`After 1.5 years, 12.5% of a 6 g sample of Polonium remains. What is the half-life in days? <span class="src">Word problem 7</span>`, stepLabel: "Step 1 of 3",
        q: "How many half-lives does it take to get to 12.5%?", choices: ["3", "2", "4", "8"],
        hints: ["Start at 100% and keep halving. Count the steps until 12.5%."], steps: ["100% → 50% (1)", "50% → 25% (2)", "25% → 12.5% (3)"], why: "3 halvings." },
      { ctx: R`3 half-lives happened in 1.5 years. The answer must be in days.`, stepLabel: "Step 2 of 3",
        q: "How many days is 1.5 years?", choices: ["547.5", "365", "450", "540"],
        hints: [R`\(1.5 \times 365\)`], steps: [R`\(1.5 \times 365 = 547.5\) days`], why: "547.5 days." },
      { ctx: R`3 half-lives in 547.5 days.`, stepLabel: "Step 3 of 3",
        q: "How long is ONE half-life?", choices: ["182.5 days", "1642.5 days", "273.75 days", "0.5 days"],
        hints: [R`\(547.5 \div 3\)`], steps: [R`\(547.5 \div 3 = 182.5\)`], why: "Answer: 182.5 days." },
      // WP8
      { ctx: R`A femur bone is found. Its carbon-14 has decayed to 6.25% of the original. The half-life of carbon-14 is 5760 years. How old is the bone? <span class="src">Word problem 8</span>`, stepLabel: "Step 1 of 2",
        q: "How many half-lives to get to 6.25%?", choices: ["4", "3", "5", "16"],
        hints: ["100 → 50 → 25 → 12.5 → 6.25. Count the arrows."], steps: ["100 → 50 → 25 → 12.5 → 6.25", "That's 4 halvings."], why: "4 half-lives." },
      { ctx: R`4 half-lives. Each one is 5760 years.`, stepLabel: "Step 2 of 2",
        q: "How old is the bone?", choices: ["23 040 years", "1440 years", "5764 years", "92 160 years"],
        hints: [R`\(4 \times 5760\)`], steps: [R`\(4 \times 5760 = 23\,040\)`], why: "Answer: 23 040 years." },
      // WP9
      { ctx: R`Red-winged blackbirds are <b>decreasing</b> at 2.5% per year. Start with 800 birds. How many after 10 years? <span class="src">Word problem 9</span>`, stepLabel: "Step 1 of 2",
        q: "What do you multiply by each year?", choices: ["0.975", "1.025", "0.25", "0.75"],
        hints: ["Decreasing means 1 MINUS the decimal.", R`\(1 - 0.025\)`], steps: ["2.5% → 0.025", R`Decreasing: \(1 - 0.025 = 0.975\)`], why: "Lose 2.5%, keep 97.5% = 0.975" },
      { ctx: R`800 birds, multiply by 0.975 each year, for 10 years.`, stepLabel: "Step 2 of 2",
        q: R`Work out \(800(0.975)^{10}\)`, choices: ["about 621 birds", "about 1024 birds", "780 birds", "600 birds"],
        hints: ["Calculator: 0.975 ^ 10 ≈ 0.776. Then × 800."], steps: [R`\(0.975^{10} \approx 0.776\)`, R`\(800 \times 0.776 \approx 621\)`],
        why: R`About 621 birds.<br><span class="note">Heads up: the answer sheet says 1024. That is what you get if the birds were increasing (\(800 \times 1.025^{10}\)). The question says decreasing, so 621 is the right math. Good thing to ask your teacher about.</span>` },
      // Extra: car
      { ctx: R`Three months ago, your car's trade-in value was $3200. Now it is $3120. What will it be 6 months from now if it depreciates exponentially? <span class="src">Extra practice</span>`, stepLabel: "Step 1 of 3",
        q: "What is it multiplied by every 3 months?", choices: ["0.975", "0.80", "1.025", "80"],
        hints: [R`New ÷ old: \(3120 \div 3200\).`], steps: [R`\(3120 \div 3200 = 0.975\)`], why: "It keeps 97.5% every 3 months." },
      { ctx: R`Multiply by 0.975 every 3 months. We want 6 months from now.`, stepLabel: "Step 2 of 3",
        q: "How many 3-month periods is 6 months?", choices: ["2", "6", "3", "18"],
        hints: [R`\(6 \div 3\)`], steps: [R`\(6 \div 3 = 2\)`], why: "2 periods." },
      { ctx: R`Now worth $3120. Multiply by 0.975 two times.`, stepLabel: "Step 3 of 3",
        q: R`Work out \(3120(0.975)^2\)`, choices: ["$2965.95", "$3042.00", "$6084.00", "$2880.00"],
        hints: [R`\(0.975^2 = 0.950625\). Then × 3120.`], steps: [R`\(0.975^2 = 0.950625\)`, R`\(3120 \times 0.950625 = 2965.95\)`], why: "Answer: $2965.95" },
    ],
  },
];


// ---------- Figures for geometry questions ----------
const FIG = {
  // Right triangle: vertical leg on the left, bottom leg, hypotenuse
  right: (left, bottom, hyp) => `<svg class="fig" viewBox="0 0 240 170" role="img" aria-label="right triangle">
    <polygon points="70,20 70,140 210,140" fill="#fff" stroke="#23282F" stroke-width="2"/>
    <rect x="70" y="126" width="14" height="14" fill="none" stroke="#23282F" stroke-width="1.5"/>
    <text x="62" y="85" font-size="15" text-anchor="end" fill="#23282F">${left}</text>
    <text x="140" y="160" font-size="15" text-anchor="middle" fill="#23282F">${bottom}</text>
    <text x="148" y="72" font-size="15" fill="#23282F">${hyp}</text></svg>`,
  // Big triangle ABC (A top-left, B top-right, C bottom) with DE parallel to AB
  nested: (ab, de, eb, ce) => `<svg class="fig" viewBox="0 0 240 200" role="img" aria-label="triangle with a parallel line inside">
    <polygon points="30,30 210,30 120,180" fill="#fff" stroke="#23282F" stroke-width="2"/>
    <line x1="75" y1="105" x2="165" y2="105" stroke="#23282F" stroke-width="2"/>
    <path d="M115 25 l8 5 l-8 5 M115 100 l8 5 l-8 5" fill="none" stroke="#2F6680" stroke-width="2"/>
    <text x="18" y="28" font-size="15" font-weight="700">A</text><text x="214" y="28" font-size="15" font-weight="700">B</text>
    <text x="114" y="198" font-size="15" font-weight="700">C</text><text x="58" y="110" font-size="15" font-weight="700">D</text>
    <text x="170" y="110" font-size="15" font-weight="700">E</text>
    <text x="120" y="20" font-size="14" text-anchor="middle" fill="#2F6680">${ab}</text>
    <text x="120" y="98" font-size="14" text-anchor="middle" fill="#2F6680">${de}</text>
    <text x="196" y="72" font-size="14" fill="#2F6680">${eb}</text>
    <text x="150" y="148" font-size="14" fill="#2F6680">${ce}</text></svg>`,
};

const MISSIONS_2 = [
  {
    id: "m5", title: "Mission 5", badge: "5", sub: "Expanding brackets (Review Review 1)", minutes: "15 min",
    items: [
      { type: "lesson", title: "Expanding = multiply everything out",
        body: R`<div class="big-math">\(5(x + 2) = 5x + 10\)</div>
        <p>A number outside a bracket multiplies <b>every</b> term inside.</p>
        <div class="big-math">\((x + 4)(x + 5) = x^2 + 5x + 4x + 20 = x^2 + 9x + 20\)</div>
        <p>Two brackets: each term in the first times each term in the second (First, Outside, Inside, Last). Then collect like terms.</p>
        <p class="tip">Squared bracket = the bracket twice: \((x-2)^2 = (x-2)(x-2)\). It is NOT \(x^2 - 4\).</p>` },
      E(R`Expand \(3(x + 4)\)`, [R`\(3x + 12\)`, R`\(3x + 4\)`, R`\(x + 12\)`, R`\(7x\)`], "Multiply the 3 by the x AND by the 4.", [R`\(3 \times x = 3x\)`, R`\(3 \times 4 = 12\)`, R`\(3x + 12\)`]),
      E(R`Expand \(2(x - 5)\)`, [R`\(2x - 10\)`, R`\(2x - 5\)`, R`\(2x + 10\)`, R`\(x - 10\)`], "Multiply the 2 by both terms. Keep the minus sign.", [R`\(2 \times x = 2x\)`, R`\(2 \times (-5) = -10\)`, R`\(2x - 10\)`]),
      E(R`What is \(x \cdot x\)?`, [R`\(x^2\)`, R`\(2x\)`, R`\(x\)`, R`\(2\)`], "Same letter multiplied: add the exponents.", [R`\(x^1 \cdot x^1 = x^2\)`]),
      E(R`What is \((-2)(+4)\)?`, [R`\(-8\)`, R`\(8\)`, R`\(2\)`, R`\(-6\)`], "Negative times positive is negative.", [R`\(2 \times 4 = 8\)`, "One negative: the answer is negative, −8."]),
      { q: R`Expand and simplify \(5(x + 2)\) <span class="src">Review Review 1a</span>`, choices: [R`\(5x + 10\)`, R`\(5x + 2\)`, R`\(x + 10\)`, R`\(5x + 7\)`],
        hints: ["Multiply the 5 by each term inside."], steps: [R`\(5 \times x = 5x\)`, R`\(5 \times 2 = 10\)`, R`\(5x + 10\)`], why: R`\(5x + 10\)` },
      E(R`Expand \((x + 2)(x + 3)\)`, [R`\(x^2 + 5x + 6\)`, R`\(x^2 + 6\)`, R`\(x^2 + 6x + 5\)`, R`\(2x + 5\)`], "Four multiplications: x·x, x·3, 2·x, 2·3.", [R`\(x \cdot x = x^2\)`, R`\(x \cdot 3 = 3x\)`, R`\(2 \cdot x = 2x\)`, R`\(2 \cdot 3 = 6\)`, R`\(x^2 + 3x + 2x + 6 = x^2 + 5x + 6\)`]),
      { q: R`Expand and simplify \((x + 4)(x + 5)\) <span class="src">Review Review 1b</span>`, choices: [R`\(x^2 + 9x + 20\)`, R`\(x^2 + 20\)`, R`\(x^2 + 20x + 9\)`, R`\(2x + 9\)`],
        hints: ["First, Outside, Inside, Last: x·x, x·5, 4·x, 4·5.", "Add the two middle x terms together."], steps: [R`\(x \cdot x = x^2\)`, R`\(x \cdot 5 = 5x\)`, R`\(4 \cdot x = 4x\)`, R`\(4 \cdot 5 = 20\)`, R`\(x^2 + 5x + 4x + 20 = x^2 + 9x + 20\)`], why: R`\(x^2 + 9x + 20\)` },
      E(R`What does \((x - 2)^2\) mean?`, [R`\((x - 2)(x - 2)\)`, R`\(x^2 - 4\)`, R`\(2x - 4\)`, R`\(x^2 + 4\)`], "Squared means times itself.", [R`\((x-2)^2 = (x-2)(x-2)\)`], R`\((x - 2)(x - 2)\). This is the trap: it is NOT \(x^2 - 4\).`),
      { q: R`Expand and simplify \(2(x - 2)^2\) <span class="src">Review Review 1c</span>`, choices: [R`\(2x^2 - 8x + 8\)`, R`\(2x^2 - 8x - 8\)`, R`\(2x^2 - 8\)`, R`\(4x^2 - 8x + 8\)`],
        hints: [R`Do the square first: \((x - 2)(x - 2)\).`, R`\((x-2)(x-2) = x^2 - 4x + 4\). Now multiply every term by 2.`],
        steps: [R`\((x-2)(x-2) = x^2 - 2x - 2x + 4 = x^2 - 4x + 4\)`, R`\(2(x^2 - 4x + 4) = 2x^2 - 8x + 8\)`],
        why: R`\(2x^2 - 8x + 8\)<br><span class="note">Heads up: the answer sheet says \(-8\) at the end. \((-2)(-2) = +4\), and \(2 \times 4 = +8\), so \(+8\) is right. Good thing to ask your teacher about.</span>` },
      E(R`Expand \((x + 4)(x - 2)\)`, [R`\(x^2 + 2x - 8\)`, R`\(x^2 - 2x - 8\)`, R`\(x^2 + 2x + 8\)`, R`\(x^2 - 8\)`], "x·x, x·(−2), 4·x, 4·(−2).", [R`\(x^2 - 2x + 4x - 8\)`, R`\(-2x + 4x = 2x\)`, R`\(x^2 + 2x - 8\)`]),
      { q: R`Expand and simplify \(3(x + 4)(x - 2)\) <span class="src">Review Review 1d</span>`, choices: [R`\(3x^2 + 6x - 24\)`, R`\(7x + 20\)`, R`\(3x^2 + 2x - 8\)`, R`\(3x^2 + 6x + 24\)`],
        hints: ["Do NOT give the 3 to both brackets. Multiply the two brackets together first.", R`\((x+4)(x-2) = x^2 + 2x - 8\). Now multiply every term by 3.`],
        steps: [R`\((x+4)(x-2) = x^2 - 2x + 4x - 8 = x^2 + 2x - 8\)`, R`\(3(x^2 + 2x - 8) = 3x^2 + 6x - 24\)`], why: R`\(3x^2 + 6x - 24\)` },
    ],
  },
  {
    id: "m6", title: "Mission 6", badge: "6", sub: "Solving equations (Review Review 2)", minutes: "15 min",
    items: [
      { type: "lesson", title: "Get x alone",
        body: R`<p>An equation is a balance. Whatever you do to one side, do to the other side.</p>
        <ol><li>Expand any brackets.</li><li>Get the x terms on one side.</li><li>Get the numbers on the other side.</li><li>Divide to get x by itself.</li></ol>
        <div class="big-math">\(4x + 3 = 27 \;\to\; 4x = 24 \;\to\; x = 6\)</div>
        <p class="tip">Undo + with −. Undo × with ÷. Check by putting your answer back in.</p>` },
      E(R`Solve \(x + 8 = 15\)`, [R`\(x = 7\)`, R`\(x = 23\)`, R`\(x = -7\)`, R`\(x = 120\)`], "Subtract 8 from both sides.", [R`\(x = 15 - 8 = 7\)`]),
      E(R`Solve \(4x = -64\)`, [R`\(x = -16\)`, R`\(x = 16\)`, R`\(x = -60\)`, R`\(x = -256\)`], "Divide both sides by 4.", [R`\(x = -64 \div 4 = -16\)`]),
      E(R`Solve \(x - 4 = -28\)`, [R`\(x = -24\)`, R`\(x = -32\)`, R`\(x = 24\)`, R`\(x = 7\)`], "Add 4 to both sides.", [R`\(x = -28 + 4 = -24\)`]),
      E(R`Solve \(4x - 3 = -19\)`, [R`\(x = -4\)`, R`\(x = 4\)`, R`\(x = -5.5\)`, R`\(x = -16\)`], "Add 3 first, then divide by 4.", [R`\(4x = -19 + 3 = -16\)`, R`\(x = -16 \div 4 = -4\)`]),
      { q: R`Solve \(x = 2(-3)^2\) <span class="src">Review Review 2a</span>`, choices: [R`\(x = 18\)`, R`\(x = -18\)`, R`\(x = 36\)`, R`\(x = -12\)`],
        hints: [R`Do the power first: \((-3)^2\). The minus is inside the brackets.`], steps: [R`\((-3)^2 = (-3)(-3) = 9\)`, R`\(2 \times 9 = 18\)`], why: R`\(x = 18\)` },
      { q: R`Solve \(4x + 3 = 27\) <span class="src">Review Review 2b</span>`, choices: [R`\(x = 6\)`, R`\(x = 7.5\)`, R`\(x = 30\)`, R`\(x = 24\)`],
        hints: ["Subtract 3 from both sides first."], steps: [R`\(4x = 27 - 3 = 24\)`, R`\(x = 24 \div 4 = 6\)`], why: R`\(x = 6\)` },
      E(R`Solve \(3(x - 4) = 12\)`, [R`\(x = 8\)`, R`\(x = 4\)`, R`\(x = 5.33\)`, R`\(x = 16\)`], "Expand first: 3x − 12 = 12.", [R`\(3x - 12 = 12\)`, R`\(3x = 24\)`, R`\(x = 8\)`]),
      E(R`Solve \(-3x + 6 = 2x - 9\)`, [R`\(x = 3\)`, R`\(x = -3\)`, R`\(x = 0.6\)`, R`\(x = 15\)`], "Subtract 2x from both sides, then subtract 6.", [R`\(-3x - 2x + 6 = -9\)`, R`\(-5x = -15\)`, R`\(x = 3\)`]),
      { q: R`Solve \(2(x + 1) = -5(x + 8)\) <span class="src">Review Review 2c</span>`, choices: [R`\(x = -6\)`, R`\(x = 6\)`, R`\(x = -42\)`, R`\(x = -38\)`],
        hints: ["Expand BOTH sides first. The −5 multiplies the x and the 8.", R`\(2x + 2 = -5x - 40\). Add 5x to both sides.`],
        steps: [R`\(2x + 2 = -5x - 40\)`, R`Add \(5x\): \(7x + 2 = -40\)`, R`Subtract 2: \(7x = -42\)`, R`Divide by 7: \(x = -6\)`], why: R`\(x = -6\)` },
      { q: R`Solve \(\dfrac{x}{5} + 2 = \dfrac{x}{4}\) <span class="src">Review Review 2d</span>`, choices: [R`\(x = 40\)`, R`\(x = -40\)`, R`\(x = 20\)`, R`\(x = 10\)`],
        hints: ["Get rid of the fractions: multiply EVERY term by 20 (because 5 × 4 = 20).", R`\(4x + 40 = 5x\)`],
        steps: [R`\(20 \cdot \tfrac{x}{5} = 4x\), \(20 \cdot 2 = 40\), \(20 \cdot \tfrac{x}{4} = 5x\)`, R`\(4x + 40 = 5x\)`, R`Subtract \(4x\): \(40 = x\)`], why: R`\(x = 40\)` },
    ],
  },
  {
    id: "m7", title: "Mission 7", badge: "7", sub: "Ratios, rates and proportions (Review Review 3–4)", minutes: "15 min",
    items: [
      { type: "lesson", title: "Ratios, rates and proportions",
        body: R`<p><b>Ratio:</b> compares things with the same units, written a : b. Always reduce it, like a fraction. 33 : 44 = 3 : 4.</p>
        <p><b>Rate:</b> compares different units. Reduce to "per 1". 320 km in 3.5 h → \(320 \div 3.5 \approx 91\) km/h.</p>
        <p><b>Proportion:</b> two equal ratios. Cross-multiply to solve.</p>
        <div class="big-math">\(\dfrac{3}{8} = \dfrac{x}{13} \;\to\; 8x = 39 \;\to\; x = 4.875\)</div>
        <p class="tip">Nearest tenth = 1 decimal place. Nearest hundredth = 2 decimal places.</p>` },
      E("Simplify the ratio 33 : 44", ["3 : 4", "11 : 4", "1 : 2", "4 : 3"], "Both numbers divide by 11.", ["33 ÷ 11 = 3", "44 ÷ 11 = 4", "3 : 4"]),
      E("6 false answers to 9 correct answers, as a ratio in lowest terms?", ["2 : 3", "3 : 2", "6 : 15", "1 : 3"], "Write 6 : 9, then divide both by 3.", ["6 : 9", "Divide both by 3: 2 : 3"]),
      E("Simplify the three-term ratio 42 : 28 : 7", ["6 : 4 : 1", "42 : 4 : 1", "3 : 2 : 1", "6 : 4 : 7"], "All three numbers divide by 7.", ["42 ÷ 7 = 6, 28 ÷ 7 = 4, 7 ÷ 7 = 1", "6 : 4 : 1"]),
      E("15 cans cost $3. What is the unit rate?", ["$0.20 per can", "$5 per can", "$0.50 per can", "$45"], "Price ÷ number of cans.", [R`\(3 \div 15 = 0.20\)`, "$0.20 per can"]),
      { q: R`Write 320 km of driving in 3.5 hours as a rate, rounded to the nearest whole number. <span class="src">Review Review 3</span>`, choices: ["91 km/h", "1120 km/h", "92 km/h", "9 km/h"],
        hints: ["km ÷ hours.", R`\(320 \div 3.5 = 91.43\). Nearest whole number?`], steps: [R`\(320 \div 3.5 = 91.43\)`, "Round to the nearest whole number: 91 km/h"], why: "91 km/h" },
      E(R`Solve \(\dfrac{x}{4} = \dfrac{6}{8}\)`, [R`\(x = 3\)`, R`\(x = 12\)`, R`\(x = 2\)`, R`\(x = 1.33\)`], "Cross-multiply: 8x = 4 × 6.", [R`\(8x = 24\)`, R`\(x = 3\)`]),
      { q: R`Find x in \(\dfrac{3}{8} = \dfrac{x}{13}\), rounded to the nearest tenth. <span class="src">Review Review 4</span>`, choices: [R`\(x = 4.9\)`, R`\(x = 34.7\)`, R`\(x = 4.8\)`, R`\(x = 5.0\)`],
        hints: ["Cross-multiply: 8 × x = 3 × 13.", R`\(8x = 39\). Divide by 8, then round to 1 decimal place.`], steps: [R`\(8x = 3 \times 13 = 39\)`, R`\(x = 39 \div 8 = 4.875\)`, "Nearest tenth: 4.9"], why: R`\(x = 4.9\)` },
      E("Last year 3 out of 4 students bought a yearbook. This year there are 640 students. How many yearbooks should be sold?", ["480", "213", "853", "160"], "Set up 3/4 = x/640.", [R`\(\tfrac{3}{4} = \tfrac{x}{640}\)`, R`\(4x = 1920\)`, R`\(x = 480\)`]),
      E("A car used 24 L of gas to drive 252 km. What is the rate in km per litre?", ["10.5 km/L", "0.095 km/L", "276 km/L", "6048 km/L"], "km ÷ litres.", [R`\(252 \div 24 = 10.5\)`, "10.5 km/L"]),
    ],
  },
  {
    id: "m8", title: "Mission 8", badge: "8", sub: "Pythagorean theorem (Review Review 5)", minutes: "12 min",
    items: [
      { type: "lesson", title: "Right triangles: a² + b² = c²",
        body: R`${FIG.right("a", "b", "c")}
        <div class="big-math">\(a^2 + b^2 = c^2\)</div>
        <p><b>c</b> is the hypotenuse: the longest side, across from the square corner. <b>a</b> and <b>b</b> are the two legs.</p>
        <p>Finding the long side? <b>Add</b>: \(c = \sqrt{a^2 + b^2}\)</p>
        <p>Finding a short side? <b>Subtract</b>: \(a = \sqrt{c^2 - b^2}\)</p>
        <p class="tip">Calculator: square each side, add or subtract, then press √.</p>` },
      E("Which side is the hypotenuse?", ["The longest side, across from the square corner", "The shortest side", "Any side touching the square corner", "The bottom side"], "Look across from the little square.", ["The hypotenuse is always across from the right angle.", "It is always the longest side."]),
      E("The legs are 3 and 4. How long is the hypotenuse?", ["5", "7", "25", "12"], R`\(3^2 + 4^2 = 9 + 16\)`, [R`\(9 + 16 = 25\)`, R`\(\sqrt{25} = 5\)`]),
      E("The legs are 6 and 8. How long is the hypotenuse?", ["10", "14", "100", "48"], R`\(36 + 64\), then √.`, [R`\(6^2 + 8^2 = 36 + 64 = 100\)`, R`\(\sqrt{100} = 10\)`]),
      E("The hypotenuse is 13 and one leg is 5. How long is the other leg?", ["12", "13.93", "8", "144"], "Finding a leg: SUBTRACT.", [R`\(13^2 - 5^2 = 169 - 25 = 144\)`, R`\(\sqrt{144} = 12\)`]),
      E("Round 7.599 to the nearest hundredth.", ["7.60", "7.59", "7.50", "8.00"], "Hundredth = 2 decimal places. Look at the third decimal.", ["7.599: the third decimal is 9, so round up.", "7.60"]),
      { ctx: R`${FIG.right("2.5 m", "x", "8 m")}`, q: R`Find the unknown side x, rounded to the nearest hundredth. <span class="src">Review Review 5</span>`, choices: ["7.60 m", "8.38 m", "5.50 m", "57.75 m"],
        hints: ["8 m is across from the square corner, so it is the hypotenuse. You are finding a leg: SUBTRACT.", R`\(x = \sqrt{8^2 - 2.5^2} = \sqrt{64 - 6.25}\)`],
        steps: [R`\(8^2 = 64\) and \(2.5^2 = 6.25\)`, R`\(64 - 6.25 = 57.75\)`, R`\(\sqrt{57.75} = 7.599...\)`, "Nearest hundredth: 7.60 m"], why: "x = 7.60 m" },
      E("Is a triangle with sides 5, 12 and 13 a right triangle?", ["Yes, because 25 + 144 = 169", "No, because 5 + 12 is not 13", "Yes, because 5 + 12 is more than 13", "No, the sides are too long"], R`Check if \(5^2 + 12^2 = 13^2\).`, [R`\(25 + 144 = 169\)`, R`\(13^2 = 169\)`, "They match, so yes."]),
      E("A 10 m ladder leans on a wall. Its foot is 6 m from the wall. How high up the wall does it reach?", ["8 m", "11.66 m", "4 m", "64 m"], "The ladder is the hypotenuse. Subtract.", [R`\(10^2 - 6^2 = 100 - 36 = 64\)`, R`\(\sqrt{64} = 8\)`]),
    ],
  },
  {
    id: "m9", title: "Mission 9", badge: "9", sub: "Similar triangles (Review Review 6)", minutes: "15 min",
    items: [
      { type: "lesson", title: "Similar vs. congruent",
        body: R`<p><b>Similar:</b> same shape, different size. All angles are equal, and the sides are in the same ratio. One is a zoom of the other.</p>
        <p><b>Congruent:</b> same shape AND same size.</p>
        <p><b>Proving similar (AA):</b> show 2 pairs of equal angles. The third pair must match too, because angles in a triangle add to 180°.</p>
        <p class="tip">Naming matters: △ABC ~ △DEF means A matches D, B matches E, C matches F.</p>` },
      { type: "lesson", title: "Angles with parallel lines",
        body: R`<p><b>F pattern:</b> corresponding angles are equal.</p>
        <p><b>Z pattern:</b> alternate angles are equal.</p>
        <p><b>X pattern:</b> opposite angles are equal.</p>
        ${FIG.nested("", "", "", "")}
        <p>If DE is parallel to AB: angle C is shared by both triangles, and angle CDE = angle CAB (F pattern). So △CDE ~ △CAB by AA.</p>
        <p class="tip">To find x: small side / big side = small side / big side. Use the WHOLE side of the big triangle.</p>` },
      E("Similar triangles have…", ["Equal angles, and sides in the same ratio", "Equal sides only", "The same size and shape", "Different angles"], "Similar = zoomed copy.", ["Similar triangles have the same angles.", "Their sides are in the same ratio."]),
      E("Congruent triangles have…", ["The same shape and the same size", "The same shape, different size", "The same area only", "The same perimeter only"], "Congruent = exact copy.", ["Congruent means identical: same shape and same size."]),
      E("How many pairs of equal angles do you need to show to prove two triangles are similar?", ["2", "1", "3", "0"], "AA = Angle, Angle.", ["AA means 2 angles.", "The third pair always matches because the angles add to 180°."]),
      E("Two angles of a triangle are 35° and 60°. What is the third angle?", ["85°", "95°", "265°", "25°"], "Angles in a triangle add to 180°.", [R`\(180 - 35 - 60 = 85\)`]),
      E("In the F pattern with parallel lines, the angles are…", ["Corresponding angles, and they are equal", "Alternate angles, and they add to 180°", "Opposite angles", "Never equal"], "F = corresponding.", ["F pattern: corresponding angles, equal."]),
      E("In the Z pattern with parallel lines, the angles are…", ["Alternate angles, and they are equal", "Corresponding angles, and they add to 90°", "Opposite angles", "Never equal"], "Z = alternate.", ["Z pattern: alternate angles, equal."]),
      { ctx: R`△ABC has angle B = 35°, angle C = 60°, AC = 15 cm, BC = 30 cm. △DEF has angle E = 35°, angle F = 60°, EF = 15 cm, DF = x. <span class="src">Similar Triangles sheet</span>`, stepLabel: "Step 1 of 2",
        q: "Why are the triangles similar?", choices: ["Angle B = angle E and angle C = angle F (AA)", "All three sides are equal", "They are the same size", "Both have a side of 15 cm"],
        hints: ["Look at the angles. How many pairs match?"], steps: ["Angle B = angle E = 35°", "Angle C = angle F = 60°", "2 pairs of equal angles: similar by AA"], why: "Two pairs of equal angles: AA." },
      { ctx: R`△ABC ~ △DEF. BC = 30 cm matches EF = 15 cm. AC = 15 cm matches DF = x.`, stepLabel: "Step 2 of 2",
        q: "Find x.", choices: ["7.5 cm", "30 cm", "13 cm", "52 cm"],
        hints: ["EF / BC = 15 / 30 = 1/2. The small triangle is half size.", R`\(\tfrac{x}{15} = \tfrac{15}{30}\)`], steps: [R`\(\tfrac{x}{15} = \tfrac{15}{30}\)`, R`\(30x = 225\)`, R`\(x = 7.5\)`], why: "x = 7.5 cm" },
      { ctx: R`${FIG.nested("9", "x", "2", "4")}DE is parallel to AB. AB = 9, DE = x, CE = 4, EB = 2. <span class="src">Review Review 6</span>`, stepLabel: "Step 1 of 3",
        q: "Why is △CDE similar to △CAB?", choices: ["Angle C is shared, and angle CDE = angle CAB (F pattern), so AA", "All three sides are equal", "They are the same size", "DE is half of AB"],
        hints: ["Which angle is in both triangles? What do parallel lines give you?"], steps: ["Angle C is in both triangles.", "DE ∥ AB, so angle CDE = angle CAB (corresponding, F pattern).", "2 pairs of equal angles: similar by AA."], why: "AA: shared angle C, plus corresponding angles from the parallel lines." },
      { ctx: R`${FIG.nested("9", "x", "2", "4")}CE = 4 and EB = 2.`, stepLabel: "Step 2 of 3",
        q: "How long is the whole side CB?", choices: ["6", "2", "4", "8"],
        hints: ["CB is CE plus EB."], steps: [R`\(CB = 4 + 2 = 6\)`], why: "CB = 6. Always use the WHOLE side of the big triangle." },
      { ctx: R`${FIG.nested("9", "x", "2", "4")}Small △CDE: DE = x, CE = 4. Big △CAB: AB = 9, CB = 6.`, stepLabel: "Step 3 of 3",
        q: "Find x.", choices: ["6 m", "13.5 m", "4.5 m", "18 m"],
        hints: ["small / big = small / big", R`\(\tfrac{x}{9} = \tfrac{4}{6}\)`], steps: [R`\(\tfrac{x}{9} = \tfrac{4}{6}\)`, R`Cross-multiply: \(6x = 36\)`, R`\(x = 6\)`], why: "x = 6 m" },
      { ctx: R`${FIG.nested("x", "6", "4", "8")}DE is parallel to AB. AB = x, DE = 6, CE = 8, EB = 4. <span class="src">Similar Triangles sheet</span>`,
        q: "Find x.", choices: ["9", "12", "3", "4"],
        hints: ["Whole side CB = 8 + 4 = 12.", R`\(\tfrac{x}{6} = \tfrac{12}{8}\)`], steps: [R`\(CB = 8 + 4 = 12\)`, R`\(\tfrac{x}{6} = \tfrac{12}{8}\)`, R`\(8x = 72\)`, R`\(x = 9\)`], why: "x = 9" },
    ],
  },
];
MISSIONS.push(...MISSIONS_2);

RULES.push(
  { name: "Expanding", rule: R`\(5(x + 2) = 5x + 10\)`, plain: "Multiply the outside number by every term inside." },
  { name: "Two brackets (FOIL)", rule: R`\((x + 4)(x + 5) = x^2 + 9x + 20\)`, plain: "Each term in the first bracket times each term in the second, then collect like terms. \\((x-2)^2 = (x-2)(x-2)\\), not \\(x^2 - 4\\)." },
  { name: "Solving equations", rule: R`\(4x + 3 = 27 \to 4x = 24 \to x = 6\)`, plain: "Do the same thing to both sides. Expand first, x terms on one side, numbers on the other, then divide." },
  { name: "Fractions in an equation", rule: R`\(\tfrac{x}{5} + 2 = \tfrac{x}{4} \to 4x + 40 = 5x\)`, plain: "Multiply every term by the common denominator (here 20) to clear the fractions." },
  { name: "Ratio and rate", rule: R`\(33 : 44 = 3 : 4\)`, plain: "Reduce ratios like fractions. A rate is per 1: 320 km ÷ 3.5 h ≈ 91 km/h." },
  { name: "Proportion", rule: R`\(\tfrac{3}{8} = \tfrac{x}{13} \to 8x = 39\)`, plain: "Cross-multiply, then divide." },
  { name: "Pythagorean theorem", rule: R`\(a^2 + b^2 = c^2\)`, plain: "c is the longest side, across from the square corner. Finding c: add. Finding a leg: subtract. Then √." },
  { name: "Similar triangles", rule: R`\(\tfrac{\text{small}}{\text{big}} = \tfrac{\text{small}}{\text{big}}\)`, plain: "Prove similar with 2 equal angles (AA). Parallel lines: F = corresponding (equal), Z = alternate (equal), X = opposite (equal). Use the whole side of the big triangle." },
);

// Practice test: pick the review-sheet questions (marked with "Review") + final steps of word problems.
