import type { Problem } from "./types";

export const easyProblems: Problem[] = [
  {
    id: 1,
    slug: "pair-to-target",
    title: "Pair to Target",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description:
      "You are given a list of whole numbers `nums` and a number `target`. Find the **two different positions** whose values add up to `target`, and return those positions as `[i, j]` with `i < j`.\n\nExactly one valid pair exists for every input.",
    examples: [
      { input: "nums = [3, 8, 11, 2], target = 10", output: "[1, 3]", explanation: "nums[1] + nums[3] = 8 + 2 = 10." },
      { input: "nums = [5, 5], target = 10", output: "[0, 1]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i], target <= 10^9", "Exactly one answer exists."],
    hints: ["For each number x, what partner would you need?", "A dictionary from value to index lets you find that partner in O(1)."],
    entry: { python: "pair_to_target", javascript: "pairToTarget" },
    starter: {
      python: "class Solution:\n    def pair_to_target(self, nums: list[int], target: int) -> list[int]:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction pairToTarget(nums, target) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def pair_to_target(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, x in enumerate(nums):\n            if target - x in seen:\n                return [seen[target - x], i]\n            seen[x] = i\n        return []\n",
      javascript:
        "function pairToTarget(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[3, 8, 11, 2], 10], expected: [1, 3] },
      { args: [[5, 5], 10], expected: [0, 1] },
      { args: [[-4, 7, 1, 20], -3], expected: [0, 2] },
      { args: [[0, 9, 4, 0], 0], expected: [0, 3] },
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 100], 109], expected: [8, 9] },
    ],
  },
  {
    id: 2,
    slug: "balanced-brackets",
    title: "Balanced Brackets",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    description:
      "A string `s` contains only the characters `(`, `)`, `[`, `]`, `{` and `}`. Return `true` if every opening bracket is closed by the same kind of bracket, and in the correct order. Otherwise return `false`.",
    examples: [
      { input: 's = "{[]()}"', output: "true" },
      { input: 's = "([)]"', output: "false", explanation: "The `[` is closed by `)` before its own `]`." },
    ],
    constraints: ["0 <= s.length <= 10^4", "s contains only bracket characters."],
    hints: ["The most recent unclosed bracket must be closed first. Which data structure works that way?"],
    entry: { python: "is_balanced", javascript: "isBalanced" },
    starter: {
      python: "class Solution:\n    def is_balanced(self, s: str) -> bool:\n        pass\n",
      javascript: "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isBalanced(s) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def is_balanced(self, s: str) -> bool:\n        pairs = {')': '(', ']': '[', '}': '{'}\n        stack = []\n        for c in s:\n            if c in pairs:\n                if not stack or stack.pop() != pairs[c]:\n                    return False\n            else:\n                stack.append(c)\n        return not stack\n",
      javascript:
        "function isBalanced(s) {\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  for (const c of s) {\n    if (c in pairs) {\n      if (stack.pop() !== pairs[c]) return false;\n    } else stack.push(c);\n  }\n  return stack.length === 0;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: ["{[]()}"], expected: true },
      { args: ["([)]"], expected: false },
      { args: [""], expected: true },
      { args: ["((("], expected: false },
      { args: ["}"], expected: false },
      { args: ["[{()}]{}()"], expected: true },
    ],
  },
  {
    id: 3,
    slug: "fizz-buzz-list",
    title: "Fizz Buzz List",
    difficulty: "Easy",
    tags: ["Math", "String"],
    description:
      "Given a number `n`, return a list of strings for every number from `1` to `n`:\n\n- `\"FizzBuzz\"` if the number is divisible by both 3 and 5\n- `\"Fizz\"` if it is divisible by 3 only\n- `\"Buzz\"` if it is divisible by 5 only\n- the number itself as a string otherwise",
    examples: [{ input: "n = 5", output: '["1", "2", "Fizz", "4", "Buzz"]' }],
    constraints: ["1 <= n <= 10^4"],
    entry: { python: "fizz_buzz", javascript: "fizzBuzz" },
    starter: {
      python: "class Solution:\n    def fizz_buzz(self, n: int) -> list[str]:\n        pass\n",
      javascript: "/**\n * @param {number} n\n * @return {string[]}\n */\nfunction fizzBuzz(n) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def fizz_buzz(self, n: int) -> list[str]:\n        out = []\n        for i in range(1, n + 1):\n            s = ('Fizz' if i % 3 == 0 else '') + ('Buzz' if i % 5 == 0 else '')\n            out.append(s or str(i))\n        return out\n",
      javascript:
        "function fizzBuzz(n) {\n  const out = [];\n  for (let i = 1; i <= n; i++) {\n    const s = (i % 3 === 0 ? 'Fizz' : '') + (i % 5 === 0 ? 'Buzz' : '');\n    out.push(s || String(i));\n  }\n  return out;\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
      { args: [1], expected: ["1"] },
      { args: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
    ],
  },
  {
    id: 4,
    slug: "best-day-to-trade",
    title: "Best Day to Trade",
    difficulty: "Easy",
    tags: ["Array", "Greedy"],
    description:
      "`prices[i]` is the price of a coin on day `i`. You may buy once and then sell once on a **later** day. Return the largest profit you can make. If no profit is possible, return `0`.",
    examples: [
      { input: "prices = [9, 2, 6, 1, 7, 3]", output: "6", explanation: "Buy on day 3 at 1, sell on day 4 at 7." },
      { input: "prices = [8, 6, 4]", output: "0" },
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    hints: ["Track the cheapest price seen so far while walking forward."],
    entry: { python: "max_profit", javascript: "maxProfit" },
    starter: {
      python: "class Solution:\n    def max_profit(self, prices: list[int]) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def max_profit(self, prices: list[int]) -> int:\n        lo, best = float('inf'), 0\n        for p in prices:\n            lo = min(lo, p)\n            best = max(best, p - lo)\n        return best\n",
      javascript:
        "function maxProfit(prices) {\n  let lo = Infinity, best = 0;\n  for (const p of prices) {\n    lo = Math.min(lo, p);\n    best = Math.max(best, p - lo);\n  }\n  return best;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[9, 2, 6, 1, 7, 3]], expected: 6 },
      { args: [[8, 6, 4]], expected: 0 },
      { args: [[5]], expected: 0 },
      { args: [[1, 2, 3, 4, 5]], expected: 4 },
      { args: [[3, 3, 3]], expected: 0 },
      { args: [[2, 10, 1, 4]], expected: 8 },
    ],
  },
  {
    id: 5,
    slug: "sorted-search",
    title: "Sorted Search",
    difficulty: "Easy",
    tags: ["Array", "Binary Search"],
    description:
      "`nums` is sorted in increasing order and has no repeated values. Return the index of `target` in `nums`, or `-1` if it is not there.\n\nYour solution should run in **O(log n)** time.",
    examples: [
      { input: "nums = [-3, 0, 4, 9, 15], target = 9", output: "3" },
      { input: "nums = [1, 2, 3], target = 7", output: "-1" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "nums is strictly increasing."],
    hints: ["Compare the target with the middle element and drop half the list each step."],
    entry: { python: "search", javascript: "search" },
    starter: {
      python: "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        lo, hi = 0, len(nums) - 1\n        while lo <= hi:\n            mid = (lo + hi) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[mid] < target:\n                lo = mid + 1\n            else:\n                hi = mid - 1\n        return -1\n",
      javascript:
        "function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[-3, 0, 4, 9, 15], 9], expected: 3 },
      { args: [[1, 2, 3], 7], expected: -1 },
      { args: [[5], 5], expected: 0 },
      { args: [[5], -5], expected: -1 },
      { args: [[1, 3, 5, 7, 9, 11, 13], 1], expected: 0 },
      { args: [[1, 3, 5, 7, 9, 11, 13], 13], expected: 6 },
    ],
  },
  {
    id: 6,
    slug: "any-repeats",
    title: "Any Repeats?",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: "Return `true` if some value appears **at least twice** in `nums`, and `false` if every value is different.",
    examples: [
      { input: "nums = [4, 1, 7, 4]", output: "true" },
      { input: "nums = [10, 20, 30]", output: "false" },
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    entry: { python: "has_repeat", javascript: "hasRepeat" },
    starter: {
      python: "class Solution:\n    def has_repeat(self, nums: list[int]) -> bool:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction hasRepeat(nums) {\n  \n}\n",
    },
    solution: {
      python: "class Solution:\n    def has_repeat(self, nums: list[int]) -> bool:\n        return len(set(nums)) != len(nums)\n",
      javascript: "function hasRepeat(nums) {\n  return new Set(nums).size !== nums.length;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[4, 1, 7, 4]], expected: true },
      { args: [[10, 20, 30]], expected: false },
      { args: [[1]], expected: false },
      { args: [[-1, -1]], expected: true },
      { args: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 0]], expected: true },
    ],
  },
  {
    id: 7,
    slug: "same-letters",
    title: "Same Letters",
    difficulty: "Easy",
    tags: ["String", "Hash Table", "Sorting"],
    description:
      "Return `true` if string `b` can be made by rearranging **all** the letters of string `a` (each letter used exactly as many times). Otherwise return `false`.",
    examples: [
      { input: 'a = "listen", b = "silent"', output: "true" },
      { input: 'a = "apple", b = "paple"', output: "true" },
      { input: 'a = "car", b = "cat"', output: "false" },
    ],
    constraints: ["1 <= a.length, b.length <= 5 * 10^4", "Only lowercase English letters."],
    entry: { python: "same_letters", javascript: "sameLetters" },
    starter: {
      python: "class Solution:\n    def same_letters(self, a: str, b: str) -> bool:\n        pass\n",
      javascript: "/**\n * @param {string} a\n * @param {string} b\n * @return {boolean}\n */\nfunction sameLetters(a, b) {\n  \n}\n",
    },
    solution: {
      python: "from collections import Counter\n\nclass Solution:\n    def same_letters(self, a: str, b: str) -> bool:\n        return Counter(a) == Counter(b)\n",
      javascript: "function sameLetters(a, b) {\n  return a.split('').sort().join('') === b.split('').sort().join('');\n}\n",
    },
    sampleCount: 3,
    tests: [
      { args: ["listen", "silent"], expected: true },
      { args: ["apple", "paple"], expected: true },
      { args: ["car", "cat"], expected: false },
      { args: ["a", "aa"], expected: false },
      { args: ["abcabc", "cbacba"], expected: true },
    ],
  },
  {
    id: 8,
    slug: "zeroes-to-the-back",
    title: "Zeroes to the Back",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers"],
    description:
      "Move every `0` in `nums` to the end of the list while keeping the order of the non-zero values. Return the resulting list. Try to do it in place, using O(1) extra memory.",
    examples: [{ input: "nums = [0, 3, 0, 5, 9]", output: "[3, 5, 9, 0, 0]" }],
    constraints: ["1 <= nums.length <= 10^4"],
    hints: ["Keep a write pointer for where the next non-zero value goes."],
    entry: { python: "move_zeroes", javascript: "moveZeroes" },
    starter: {
      python: "class Solution:\n    def move_zeroes(self, nums: list[int]) -> list[int]:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction moveZeroes(nums) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def move_zeroes(self, nums: list[int]) -> list[int]:\n        w = 0\n        for i in range(len(nums)):\n            if nums[i] != 0:\n                nums[w], nums[i] = nums[i], nums[w]\n                w += 1\n        return nums\n",
      javascript:
        "function moveZeroes(nums) {\n  let w = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      [nums[w], nums[i]] = [nums[i], nums[w]];\n      w++;\n    }\n  }\n  return nums;\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[0, 3, 0, 5, 9]], expected: [3, 5, 9, 0, 0] },
      { args: [[0]], expected: [0] },
      { args: [[1, 2]], expected: [1, 2] },
      { args: [[0, 0, 1]], expected: [1, 0, 0] },
      { args: [[4, 0, -2, 0, 0, 7]], expected: [4, -2, 7, 0, 0, 0] },
    ],
  },
  {
    id: 9,
    slug: "climbing-steps",
    title: "Climbing Steps",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    description:
      "A staircase has `n` steps. Each move, you climb either **1** or **2** steps. In how many different ways can you reach the top?",
    examples: [
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
      { input: "n = 1", output: "1" },
    ],
    constraints: ["1 <= n <= 45"],
    hints: ["The last move was either 1 step or 2 steps. So ways(n) = ways(n-1) + ways(n-2)."],
    entry: { python: "count_ways", javascript: "countWays" },
    starter: {
      python: "class Solution:\n    def count_ways(self, n: int) -> int:\n        pass\n",
      javascript: "/**\n * @param {number} n\n * @return {number}\n */\nfunction countWays(n) {\n  \n}\n",
    },
    solution: {
      python: "class Solution:\n    def count_ways(self, n: int) -> int:\n        a, b = 1, 1\n        for _ in range(n):\n            a, b = b, a + b\n        return a\n",
      javascript: "function countWays(n) {\n  let a = 1, b = 1;\n  for (let i = 0; i < n; i++) [a, b] = [b, a + b];\n  return a;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [3], expected: 3 },
      { args: [1], expected: 1 },
      { args: [2], expected: 2 },
      { args: [5], expected: 8 },
      { args: [10], expected: 89 },
      { args: [45], expected: 1836311903 },
    ],
  },
  {
    id: 10,
    slug: "the-lonely-number",
    title: "The Lonely Number",
    difficulty: "Easy",
    tags: ["Array", "Bit Manipulation"],
    description:
      "In `nums`, every value appears exactly **twice** except for one value that appears once. Return that value.\n\nCan you do it with O(1) extra memory?",
    examples: [{ input: "nums = [7, 3, 7, 9, 3]", output: "9" }],
    constraints: ["1 <= nums.length <= 3 * 10^4", "nums.length is odd."],
    hints: ["x XOR x = 0 and x XOR 0 = x."],
    entry: { python: "lonely_number", javascript: "lonelyNumber" },
    starter: {
      python: "class Solution:\n    def lonely_number(self, nums: list[int]) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction lonelyNumber(nums) {\n  \n}\n",
    },
    solution: {
      python: "class Solution:\n    def lonely_number(self, nums: list[int]) -> int:\n        r = 0\n        for x in nums:\n            r ^= x\n        return r\n",
      javascript: "function lonelyNumber(nums) {\n  return nums.reduce((a, b) => a ^ b, 0);\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[7, 3, 7, 9, 3]], expected: 9 },
      { args: [[1]], expected: 1 },
      { args: [[-5, 2, 2]], expected: -5 },
      { args: [[0, 4, 4, 6, 6]], expected: 0 },
    ],
  },
  {
    id: 11,
    slug: "the-missing-one",
    title: "The Missing One",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    description:
      "`nums` holds `n` different numbers taken from the range `0..n` (inclusive). Exactly one number from that range is missing. Return it.",
    examples: [
      { input: "nums = [3, 0, 1]", output: "2" },
      { input: "nums = [0]", output: "1" },
    ],
    constraints: ["1 <= n <= 10^4", "All values are different."],
    entry: { python: "find_missing", javascript: "findMissing" },
    starter: {
      python: "class Solution:\n    def find_missing(self, nums: list[int]) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findMissing(nums) {\n  \n}\n",
    },
    solution: {
      python: "class Solution:\n    def find_missing(self, nums: list[int]) -> int:\n        n = len(nums)\n        return n * (n + 1) // 2 - sum(nums)\n",
      javascript: "function findMissing(nums) {\n  const n = nums.length;\n  return (n * (n + 1)) / 2 - nums.reduce((a, b) => a + b, 0);\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[3, 0, 1]], expected: 2 },
      { args: [[0]], expected: 1 },
      { args: [[1]], expected: 0 },
      { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
    ],
  },
  {
    id: 12,
    slug: "mirror-phrase",
    title: "Mirror Phrase",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    description:
      "A phrase is a **mirror phrase** if, after removing everything that is not a letter or digit and lowercasing all letters, it reads the same forwards and backwards. Return `true` if `s` is a mirror phrase.",
    examples: [
      { input: 's = "Never odd, or even."', output: "true" },
      { input: 's = "abc"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 2 * 10^5", "s contains printable ASCII characters."],
    entry: { python: "is_mirror", javascript: "isMirror" },
    starter: {
      python: "class Solution:\n    def is_mirror(self, s: str) -> bool:\n        pass\n",
      javascript: "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isMirror(s) {\n  \n}\n",
    },
    solution: {
      python: "class Solution:\n    def is_mirror(self, s: str) -> bool:\n        t = [c.lower() for c in s if c.isalnum()]\n        return t == t[::-1]\n",
      javascript: "function isMirror(s) {\n  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return t === t.split('').reverse().join('');\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: ["Never odd, or even."], expected: true },
      { args: ["abc"], expected: false },
      { args: [" "], expected: true },
      { args: ["0P"], expected: false },
      { args: ["Was it a car or a cat I saw?"], expected: true },
    ],
  },
  {
    id: 13,
    slug: "first-unique-letter",
    title: "First Unique Letter",
    difficulty: "Easy",
    tags: ["String", "Hash Table"],
    description: "Return the index of the first character in `s` that appears only **once**. If there is no such character, return `-1`.",
    examples: [
      { input: 's = "swiss"', output: "1", explanation: "'w' is the first character that is not repeated." },
      { input: 's = "aabb"', output: "-1" },
    ],
    constraints: ["1 <= s.length <= 10^5", "Only lowercase English letters."],
    entry: { python: "first_unique", javascript: "firstUnique" },
    starter: {
      python: "class Solution:\n    def first_unique(self, s: str) -> int:\n        pass\n",
      javascript: "/**\n * @param {string} s\n * @return {number}\n */\nfunction firstUnique(s) {\n  \n}\n",
    },
    solution: {
      python:
        "from collections import Counter\n\nclass Solution:\n    def first_unique(self, s: str) -> int:\n        c = Counter(s)\n        for i, ch in enumerate(s):\n            if c[ch] == 1:\n                return i\n        return -1\n",
      javascript:
        "function firstUnique(s) {\n  const c = {};\n  for (const ch of s) c[ch] = (c[ch] || 0) + 1;\n  for (let i = 0; i < s.length; i++) if (c[s[i]] === 1) return i;\n  return -1;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: ["swiss"], expected: 1 },
      { args: ["aabb"], expected: -1 },
      { args: ["z"], expected: 0 },
      { args: ["loveleetlove"], expected: 7 },
    ],
  },
  {
    id: 14,
    slug: "shared-start",
    title: "Shared Start",
    difficulty: "Easy",
    tags: ["String"],
    description: "Return the longest string that **every** word in `words` starts with. If there is none, return an empty string `\"\"`.",
    examples: [
      { input: 'words = ["interview", "internet", "interval"]', output: '"inter"' },
      { input: 'words = ["dog", "cat"]', output: '""' },
    ],
    constraints: ["1 <= words.length <= 200", "0 <= words[i].length <= 200"],
    entry: { python: "shared_start", javascript: "sharedStart" },
    starter: {
      python: "class Solution:\n    def shared_start(self, words: list[str]) -> str:\n        pass\n",
      javascript: "/**\n * @param {string[]} words\n * @return {string}\n */\nfunction sharedStart(words) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def shared_start(self, words: list[str]) -> str:\n        lo, hi = min(words), max(words)\n        i = 0\n        while i < len(lo) and lo[i] == hi[i]:\n            i += 1\n        return lo[:i]\n",
      javascript:
        "function sharedStart(words) {\n  let p = words[0];\n  for (const w of words) while (!w.startsWith(p)) p = p.slice(0, -1);\n  return p;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [["interview", "internet", "interval"]], expected: "inter" },
      { args: [["dog", "cat"]], expected: "" },
      { args: [["alone"]], expected: "alone" },
      { args: [["ab", "a"]], expected: "a" },
      { args: [["", "abc"]], expected: "" },
    ],
  },
  {
    id: 15,
    slug: "most-common-value",
    title: "Most Common Value",
    difficulty: "Easy",
    tags: ["Array", "Hash Table", "Counting"],
    description:
      "In `nums`, one value appears **more than half** of the time. Return it.\n\nFollow-up: can you solve it in O(n) time and O(1) memory?",
    examples: [{ input: "nums = [2, 7, 2, 2, 5]", output: "2" }],
    constraints: ["1 <= nums.length <= 5 * 10^4", "A majority value always exists."],
    hints: ["Look up the Boyer–Moore voting algorithm."],
    entry: { python: "majority", javascript: "majority" },
    starter: {
      python: "class Solution:\n    def majority(self, nums: list[int]) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction majority(nums) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def majority(self, nums: list[int]) -> int:\n        cand, count = None, 0\n        for x in nums:\n            if count == 0:\n                cand = x\n            count += 1 if x == cand else -1\n        return cand\n",
      javascript:
        "function majority(nums) {\n  let cand = null, count = 0;\n  for (const x of nums) {\n    if (count === 0) cand = x;\n    count += x === cand ? 1 : -1;\n  }\n  return cand;\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[2, 7, 2, 2, 5]], expected: 2 },
      { args: [[1]], expected: 1 },
      { args: [[3, 3, 4]], expected: 3 },
      { args: [[6, 5, 5]], expected: 5 },
    ],
  },
];
