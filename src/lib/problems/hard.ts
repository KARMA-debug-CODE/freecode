import type { Problem } from "./types";

export const hardProblems: Problem[] = [
  {
    id: 28,
    slug: "rain-between-towers",
    title: "Rain Between Towers",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Stack"],
    description:
      "`heights[i]` is the height of a tower of width 1. After a heavy rain, water collects in the gaps between towers. Return the total units of water trapped.",
    examples: [
      { input: "heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]", output: "6" },
      { input: "heights = [4, 2, 0, 3, 2, 5]", output: "9" },
    ],
    constraints: ["1 <= heights.length <= 2 * 10^4", "0 <= heights[i] <= 10^5"],
    hints: ["Water above cell i = min(tallest on the left, tallest on the right) - heights[i].", "Two pointers can track both maximums in one pass."],
    entry: { python: "trapped_rain", javascript: "trappedRain" },
    starter: {
      python: "class Solution:\n    def trapped_rain(self, heights: list[int]) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} heights\n * @return {number}\n */\nfunction trappedRain(heights) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def trapped_rain(self, heights: list[int]) -> int:\n        i, j = 0, len(heights) - 1\n        lmax = rmax = water = 0\n        while i < j:\n            if heights[i] < heights[j]:\n                lmax = max(lmax, heights[i])\n                water += lmax - heights[i]\n                i += 1\n            else:\n                rmax = max(rmax, heights[j])\n                water += rmax - heights[j]\n                j -= 1\n        return water\n",
      javascript:
        "function trappedRain(heights) {\n  let i = 0, j = heights.length - 1, lmax = 0, rmax = 0, water = 0;\n  while (i < j) {\n    if (heights[i] < heights[j]) { lmax = Math.max(lmax, heights[i]); water += lmax - heights[i++]; }\n    else { rmax = Math.max(rmax, heights[j]); water += rmax - heights[j--]; }\n  }\n  return water;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[3]], expected: 0 },
      { args: [[1, 2, 3, 4]], expected: 0 },
      { args: [[5, 0, 5]], expected: 5 },
    ],
  },
  {
    id: 29,
    slug: "word-transform-cost",
    title: "Word Transform Cost",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming"],
    description:
      "You can change word `a` with three operations, each costing 1: **insert** a character, **delete** a character, or **replace** a character. Return the smallest total cost to turn `a` into `b`.",
    examples: [
      { input: 'a = "kitten", b = "sitting"', output: "3", explanation: "k→s, e→i, insert g." },
      { input: 'a = "", b = "abc"', output: "3" },
    ],
    constraints: ["0 <= a.length, b.length <= 500"],
    hints: ["Let d[i][j] be the cost of turning the first i characters of a into the first j characters of b."],
    entry: { python: "transform_cost", javascript: "transformCost" },
    starter: {
      python: "class Solution:\n    def transform_cost(self, a: str, b: str) -> int:\n        pass\n",
      javascript: "/**\n * @param {string} a\n * @param {string} b\n * @return {number}\n */\nfunction transformCost(a, b) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def transform_cost(self, a: str, b: str) -> int:\n        prev = list(range(len(b) + 1))\n        for i in range(1, len(a) + 1):\n            cur = [i] + [0] * len(b)\n            for j in range(1, len(b) + 1):\n                if a[i - 1] == b[j - 1]:\n                    cur[j] = prev[j - 1]\n                else:\n                    cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])\n            prev = cur\n        return prev[-1]\n",
      javascript:
        "function transformCost(a, b) {\n  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);\n  for (let i = 1; i <= a.length; i++) {\n    const cur = [i];\n    for (let j = 1; j <= b.length; j++)\n      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);\n    prev = cur;\n  }\n  return prev[b.length];\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: ["kitten", "sitting"], expected: 3 },
      { args: ["", "abc"], expected: 3 },
      { args: ["same", "same"], expected: 0 },
      { args: ["horse", "ros"], expected: 3 },
      { args: ["intention", "execution"], expected: 5 },
    ],
  },
  {
    id: 30,
    slug: "window-maximums",
    title: "Window Maximums",
    difficulty: "Hard",
    tags: ["Array", "Sliding Window", "Monotonic Queue"],
    description:
      "A window of size `k` slides across `nums` from left to right, one position at a time. Return the largest value inside the window at each position.\n\nAim for O(n) total time.",
    examples: [{ input: "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3", output: "[3, 3, 5, 5, 6, 7]" }],
    constraints: ["1 <= k <= nums.length <= 10^5"],
    hints: ["Keep a deque of indices whose values are in decreasing order."],
    entry: { python: "window_max", javascript: "windowMax" },
    starter: {
      python: "class Solution:\n    def window_max(self, nums: list[int], k: int) -> list[int]:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction windowMax(nums, k) {\n  \n}\n",
    },
    solution: {
      python:
        "from collections import deque\n\nclass Solution:\n    def window_max(self, nums: list[int], k: int) -> list[int]:\n        dq, out = deque(), []\n        for i, x in enumerate(nums):\n            while dq and nums[dq[-1]] <= x:\n                dq.pop()\n            dq.append(i)\n            if dq[0] <= i - k:\n                dq.popleft()\n            if i >= k - 1:\n                out.append(nums[dq[0]])\n        return out\n",
      javascript:
        "function windowMax(nums, k) {\n  const dq = [], out = [];\n  let head = 0;\n  for (let i = 0; i < nums.length; i++) {\n    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();\n    dq.push(i);\n    if (dq[head] <= i - k) head++;\n    if (i >= k - 1) out.push(nums[dq[head]]);\n  }\n  return out;\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { args: [[4], 1], expected: [4] },
      { args: [[9, 8, 7, 6], 2], expected: [9, 8, 7] },
      { args: [[1, 2, 3, 4], 4], expected: [4] },
    ],
  },
];
