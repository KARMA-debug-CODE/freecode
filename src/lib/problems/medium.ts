import type { Problem } from "./types";

export const mediumProblems: Problem[] = [
  {
    id: 16,
    slug: "best-stretch-sum",
    title: "Best Stretch Sum",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description:
      "Find the **contiguous** stretch of `nums` (at least one value long) that has the largest sum, and return that sum.",
    examples: [
      { input: "nums = [-3, 4, -1, 2, -6, 5]", output: "5", explanation: "[4, -1, 2] sums to 5, and so does [5]." },
      { input: "nums = [-8, -2, -5]", output: "-2" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: ["At each index, either extend the previous stretch or start a new one (Kadane's algorithm)."],
    entry: { python: "best_stretch", javascript: "bestStretch" },
    starter: {
      python: "class Solution:\n    def best_stretch(self, nums: list[int]) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction bestStretch(nums) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def best_stretch(self, nums: list[int]) -> int:\n        cur = best = nums[0]\n        for x in nums[1:]:\n            cur = max(x, cur + x)\n            best = max(best, cur)\n        return best\n",
      javascript:
        "function bestStretch(nums) {\n  let cur = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    best = Math.max(best, cur);\n  }\n  return best;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[-3, 4, -1, 2, -6, 5]], expected: 5 },
      { args: [[-8, -2, -5]], expected: -2 },
      { args: [[7]], expected: 7 },
      { args: [[2, -1, 2, -1, 2]], expected: 4 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
    ],
  },
  {
    id: 17,
    slug: "products-of-the-others",
    title: "Products of the Others",
    difficulty: "Medium",
    tags: ["Array", "Prefix Sum"],
    description:
      "Return a list `out` where `out[i]` is the product of every value in `nums` **except** `nums[i]`. Do not use division, and aim for O(n) time.",
    examples: [{ input: "nums = [2, 3, 4]", output: "[12, 8, 6]" }],
    constraints: ["2 <= nums.length <= 10^5", "Every product fits in a 32-bit integer."],
    hints: ["out[i] = (product of everything to the left) × (product of everything to the right)."],
    entry: { python: "others_product", javascript: "othersProduct" },
    starter: {
      python: "class Solution:\n    def others_product(self, nums: list[int]) -> list[int]:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction othersProduct(nums) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def others_product(self, nums: list[int]) -> list[int]:\n        n = len(nums)\n        out = [1] * n\n        left = 1\n        for i in range(n):\n            out[i] = left\n            left *= nums[i]\n        right = 1\n        for i in range(n - 1, -1, -1):\n            out[i] *= right\n            right *= nums[i]\n        return out\n",
      javascript:
        "function othersProduct(nums) {\n  const n = nums.length, out = new Array(n).fill(1);\n  let left = 1;\n  for (let i = 0; i < n; i++) { out[i] = left; left *= nums[i]; }\n  let right = 1;\n  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }\n  return out.map((x) => x + 0);\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[2, 3, 4]], expected: [12, 8, 6] },
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[5, 0, 2]], expected: [0, 10, 0] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
    ],
  },
  {
    id: 18,
    slug: "letter-families",
    title: "Letter Families",
    difficulty: "Medium",
    tags: ["String", "Hash Table", "Sorting"],
    description:
      "Two words are in the same **family** if one is a rearrangement of the other's letters. Group `words` into families and return the list of groups. Groups and the words inside them can be in any order.",
    examples: [
      { input: 'words = ["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]' },
    ],
    constraints: ["1 <= words.length <= 10^4", "Only lowercase English letters."],
    hints: ["Sorting a word's letters gives the same key for every member of its family."],
    entry: { python: "group_families", javascript: "groupFamilies" },
    compare: "nested-unordered",
    starter: {
      python: "class Solution:\n    def group_families(self, words: list[str]) -> list[list[str]]:\n        pass\n",
      javascript: "/**\n * @param {string[]} words\n * @return {string[][]}\n */\nfunction groupFamilies(words) {\n  \n}\n",
    },
    solution: {
      python:
        "from collections import defaultdict\n\nclass Solution:\n    def group_families(self, words: list[str]) -> list[list[str]]:\n        g = defaultdict(list)\n        for w in words:\n            g[''.join(sorted(w))].append(w)\n        return list(g.values())\n",
      javascript:
        "function groupFamilies(words) {\n  const g = new Map();\n  for (const w of words) {\n    const k = w.split('').sort().join('');\n    if (!g.has(k)) g.set(k, []);\n    g.get(k).push(w);\n  }\n  return [...g.values()];\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
      { args: [[""]], expected: [[""]] },
      { args: [["a"]], expected: [["a"]] },
      { args: [["abc", "cab", "xyz", "zyx", "q"]], expected: [["abc", "cab"], ["xyz", "zyx"], ["q"]] },
    ],
  },
  {
    id: 19,
    slug: "longest-fresh-window",
    title: "Longest Fresh Window",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hash Table"],
    description: "Return the length of the longest **contiguous** part of `s` in which no character repeats.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: '"abc" has length 3.' },
      { input: 's = "pwwkew"', output: "3" },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    hints: ["Slide a window; when a repeat appears, move the left edge past the previous occurrence."],
    entry: { python: "longest_fresh", javascript: "longestFresh" },
    starter: {
      python: "class Solution:\n    def longest_fresh(self, s: str) -> int:\n        pass\n",
      javascript: "/**\n * @param {string} s\n * @return {number}\n */\nfunction longestFresh(s) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def longest_fresh(self, s: str) -> int:\n        last, left, best = {}, 0, 0\n        for i, c in enumerate(s):\n            if last.get(c, -1) >= left:\n                left = last[c] + 1\n            last[c] = i\n            best = max(best, i - left + 1)\n        return best\n",
      javascript:
        "function longestFresh(s) {\n  const last = new Map();\n  let left = 0, best = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (last.has(s[i]) && last.get(s[i]) >= left) left = last.get(s[i]) + 1;\n    last.set(s[i], i);\n    best = Math.max(best, i - left + 1);\n  }\n  return best;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["pwwkew"], expected: 3 },
      { args: [""], expected: 0 },
      { args: ["bbbb"], expected: 1 },
      { args: ["abba"], expected: 2 },
      { args: ["dvdf"], expected: 3 },
    ],
  },
  {
    id: 20,
    slug: "k-most-frequent",
    title: "K Most Frequent",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "Heap", "Bucket Sort"],
    description:
      "Return the `k` values that appear most often in `nums`, in any order. The answer is guaranteed to be unique.",
    examples: [{ input: "nums = [4, 4, 4, 6, 6, 9], k = 2", output: "[4, 6]" }],
    constraints: ["1 <= nums.length <= 10^5", "1 <= k <= number of distinct values"],
    hints: ["Count, then pick the k biggest counts. Bucket sort by count gives O(n)."],
    entry: { python: "top_k", javascript: "topK" },
    compare: "unordered",
    starter: {
      python: "class Solution:\n    def top_k(self, nums: list[int], k: int) -> list[int]:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction topK(nums, k) {\n  \n}\n",
    },
    solution: {
      python:
        "from collections import Counter\n\nclass Solution:\n    def top_k(self, nums: list[int], k: int) -> list[int]:\n        return [x for x, _ in Counter(nums).most_common(k)]\n",
      javascript:
        "function topK(nums, k) {\n  const c = new Map();\n  for (const x of nums) c.set(x, (c.get(x) || 0) + 1);\n  return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map((e) => e[0]);\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[4, 4, 4, 6, 6, 9], 2], expected: [4, 6] },
      { args: [[1], 1], expected: [1] },
      { args: [[5, 3, 5, 3, 5, 3, 1, 2], 2], expected: [3, 5] },
      { args: [[-1, -1, 2, 2, 2, 7], 1], expected: [2] },
    ],
  },
  {
    id: 21,
    slug: "shift-right",
    title: "Shift Right",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    description:
      "Shift every value in `nums` `k` places to the right. Values that fall off the end wrap around to the front. Return the shifted list.",
    examples: [{ input: "nums = [1, 2, 3, 4, 5], k = 2", output: "[4, 5, 1, 2, 3]" }],
    constraints: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],
    hints: ["Reverse the whole list, then reverse the first k values and the rest separately."],
    entry: { python: "shift_right", javascript: "shiftRight" },
    starter: {
      python: "class Solution:\n    def shift_right(self, nums: list[int], k: int) -> list[int]:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction shiftRight(nums, k) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def shift_right(self, nums: list[int], k: int) -> list[int]:\n        k %= len(nums)\n        return nums[-k:] + nums[:-k] if k else nums\n",
      javascript:
        "function shiftRight(nums, k) {\n  k %= nums.length;\n  return nums.slice(nums.length - k).concat(nums.slice(0, nums.length - k));\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3] },
      { args: [[1, 2], 0], expected: [1, 2] },
      { args: [[1, 2, 3], 3], expected: [1, 2, 3] },
      { args: [[1, 2, 3], 4], expected: [3, 1, 2] },
      { args: [[9], 100], expected: [9] },
    ],
  },
  {
    id: 22,
    slug: "merge-time-slots",
    title: "Merge Time Slots",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    description:
      "Each item in `slots` is `[start, end]`. Merge every pair of slots that overlap or touch, and return the merged slots sorted by start time.",
    examples: [
      { input: "slots = [[1, 3], [8, 10], [2, 6]]", output: "[[1, 6], [8, 10]]" },
      { input: "slots = [[1, 4], [4, 5]]", output: "[[1, 5]]", explanation: "Slots that touch at 4 are merged." },
    ],
    constraints: ["1 <= slots.length <= 10^4", "0 <= start <= end <= 10^4"],
    entry: { python: "merge_slots", javascript: "mergeSlots" },
    starter: {
      python: "class Solution:\n    def merge_slots(self, slots: list[list[int]]) -> list[list[int]]:\n        pass\n",
      javascript: "/**\n * @param {number[][]} slots\n * @return {number[][]}\n */\nfunction mergeSlots(slots) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def merge_slots(self, slots: list[list[int]]) -> list[list[int]]:\n        out = []\n        for s, e in sorted(slots):\n            if out and s <= out[-1][1]:\n                out[-1][1] = max(out[-1][1], e)\n            else:\n                out.append([s, e])\n        return out\n",
      javascript:
        "function mergeSlots(slots) {\n  const out = [];\n  for (const [s, e] of [...slots].sort((a, b) => a[0] - b[0])) {\n    if (out.length && s <= out[out.length - 1][1]) out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);\n    else out.push([s, e]);\n  }\n  return out;\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[[1, 3], [8, 10], [2, 6]]], expected: [[1, 6], [8, 10]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[5, 7]]], expected: [[5, 7]] },
      { args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]] },
      { args: [[[6, 8], [1, 2], [3, 4]]], expected: [[1, 2], [3, 4], [6, 8]] },
    ],
  },
  {
    id: 23,
    slug: "widest-tank",
    title: "Widest Tank",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Greedy"],
    description:
      "`walls[i]` is the height of a vertical wall at position `i`. Pick two walls. Together with the ground they form a tank that holds water up to the height of the **shorter** wall. Return the largest amount of water any tank can hold: `(j - i) * min(walls[i], walls[j])`.",
    examples: [{ input: "walls = [1, 8, 6, 2, 5, 4, 8, 3, 7]", output: "49" }],
    constraints: ["2 <= walls.length <= 10^5", "0 <= walls[i] <= 10^4"],
    hints: ["Start with the widest pair and always move the pointer at the shorter wall inward."],
    entry: { python: "widest_tank", javascript: "widestTank" },
    starter: {
      python: "class Solution:\n    def widest_tank(self, walls: list[int]) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} walls\n * @return {number}\n */\nfunction widestTank(walls) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def widest_tank(self, walls: list[int]) -> int:\n        i, j, best = 0, len(walls) - 1, 0\n        while i < j:\n            best = max(best, (j - i) * min(walls[i], walls[j]))\n            if walls[i] < walls[j]:\n                i += 1\n            else:\n                j -= 1\n        return best\n",
      javascript:
        "function widestTank(walls) {\n  let i = 0, j = walls.length - 1, best = 0;\n  while (i < j) {\n    best = Math.max(best, (j - i) * Math.min(walls[i], walls[j]));\n    if (walls[i] < walls[j]) i++; else j--;\n  }\n  return best;\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
      { args: [[4, 3, 2, 1, 4]], expected: 16 },
      { args: [[0, 0, 5]], expected: 0 },
    ],
  },
  {
    id: 24,
    slug: "zero-triplets",
    title: "Zero Triplets",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    description:
      "Return every **distinct** triplet of values `[a, b, c]` taken from three different positions in `nums` such that `a + b + c == 0`. No triplet may appear twice. The triplets and the values inside each can be in any order.",
    examples: [{ input: "nums = [-1, 0, 1, 2, -1, -4]", output: "[[-1, -1, 2], [-1, 0, 1]]" }],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    hints: ["Sort first. Fix one value, then use two pointers on the rest.", "Skip repeated values to avoid duplicate triplets."],
    entry: { python: "zero_triplets", javascript: "zeroTriplets" },
    compare: "nested-unordered",
    starter: {
      python: "class Solution:\n    def zero_triplets(self, nums: list[int]) -> list[list[int]]:\n        pass\n",
      javascript: "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction zeroTriplets(nums) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def zero_triplets(self, nums: list[int]) -> list[list[int]]:\n        nums = sorted(nums)\n        out = []\n        for i in range(len(nums) - 2):\n            if i and nums[i] == nums[i - 1]:\n                continue\n            lo, hi = i + 1, len(nums) - 1\n            while lo < hi:\n                s = nums[i] + nums[lo] + nums[hi]\n                if s < 0:\n                    lo += 1\n                elif s > 0:\n                    hi -= 1\n                else:\n                    out.append([nums[i], nums[lo], nums[hi]])\n                    while lo < hi and nums[lo] == nums[lo + 1]:\n                        lo += 1\n                    lo += 1\n                    hi -= 1\n        return out\n",
      javascript:
        "function zeroTriplets(nums) {\n  nums = [...nums].sort((a, b) => a - b);\n  const out = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i && nums[i] === nums[i - 1]) continue;\n    let lo = i + 1, hi = nums.length - 1;\n    while (lo < hi) {\n      const s = nums[i] + nums[lo] + nums[hi];\n      if (s < 0) lo++;\n      else if (s > 0) hi--;\n      else {\n        out.push([nums[i], nums[lo], nums[hi]]);\n        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;\n        lo++; hi--;\n      }\n    }\n  }\n  return out;\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expected: [] },
      { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
      { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
    ],
  },
  {
    id: 25,
    slug: "fewest-coins",
    title: "Fewest Coins",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description:
      "You have an unlimited supply of coins of each value in `coins`. Return the smallest number of coins that add up to exactly `amount`, or `-1` if it is impossible.",
    examples: [
      { input: "coins = [1, 4, 5], amount = 8", output: "2", explanation: "4 + 4. Taking the biggest coin first (5 + 1 + 1 + 1) uses 4 coins." },
      { input: "coins = [3], amount = 7", output: "-1" },
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    hints: ["best[a] = 1 + min(best[a - c]) over every coin c."],
    entry: { python: "fewest_coins", javascript: "fewestCoins" },
    starter: {
      python: "class Solution:\n    def fewest_coins(self, coins: list[int], amount: int) -> int:\n        pass\n",
      javascript: "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction fewestCoins(coins, amount) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def fewest_coins(self, coins: list[int], amount: int) -> int:\n        INF = amount + 1\n        best = [0] + [INF] * amount\n        for a in range(1, amount + 1):\n            for c in coins:\n                if c <= a:\n                    best[a] = min(best[a], best[a - c] + 1)\n        return best[amount] if best[amount] <= amount else -1\n",
      javascript:
        "function fewestCoins(coins, amount) {\n  const best = new Array(amount + 1).fill(Infinity);\n  best[0] = 0;\n  for (let a = 1; a <= amount; a++)\n    for (const c of coins) if (c <= a) best[a] = Math.min(best[a], best[a - c] + 1);\n  return best[amount] === Infinity ? -1 : best[amount];\n}\n",
    },
    sampleCount: 2,
    tests: [
      { args: [[1, 4, 5], 8], expected: 2 },
      { args: [[3], 7], expected: -1 },
      { args: [[1], 0], expected: 0 },
      { args: [[1, 2, 5], 11], expected: 3 },
      { args: [[2, 5, 10, 1], 27], expected: 4 },
    ],
  },
  {
    id: 26,
    slug: "count-islands",
    title: "Count Islands",
    difficulty: "Medium",
    tags: ["Matrix", "Graph", "DFS", "BFS"],
    description:
      'A map is a grid of `"1"` (land) and `"0"` (water). An **island** is a group of land cells connected up, down, left or right. Return the number of islands.',
    examples: [
      {
        input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]',
        output: "2",
      },
    ],
    constraints: ["1 <= rows, cols <= 300"],
    hints: ["Each time you find unvisited land, flood-fill the whole island and add one to the count."],
    entry: { python: "count_islands", javascript: "countIslands" },
    starter: {
      python: "class Solution:\n    def count_islands(self, grid: list[list[str]]) -> int:\n        pass\n",
      javascript: "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction countIslands(grid) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def count_islands(self, grid: list[list[str]]) -> int:\n        R, C = len(grid), len(grid[0])\n        count = 0\n        for r in range(R):\n            for c in range(C):\n                if grid[r][c] == '1':\n                    count += 1\n                    stack = [(r, c)]\n                    grid[r][c] = '0'\n                    while stack:\n                        y, x = stack.pop()\n                        for ny, nx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):\n                            if 0 <= ny < R and 0 <= nx < C and grid[ny][nx] == '1':\n                                grid[ny][nx] = '0'\n                                stack.append((ny, nx))\n        return count\n",
      javascript:
        "function countIslands(grid) {\n  const R = grid.length, C = grid[0].length;\n  let count = 0;\n  for (let r = 0; r < R; r++)\n    for (let c = 0; c < C; c++) {\n      if (grid[r][c] !== '1') continue;\n      count++;\n      const stack = [[r, c]];\n      grid[r][c] = '0';\n      while (stack.length) {\n        const [y, x] = stack.pop();\n        for (const [ny, nx] of [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]])\n          if (ny >= 0 && ny < R && nx >= 0 && nx < C && grid[ny][nx] === '1') {\n            grid[ny][nx] = '0';\n            stack.push([ny, nx]);\n          }\n      }\n    }\n  return count;\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[["1", "1", "0"], ["0", "1", "0"], ["0", "0", "1"]]], expected: 2 },
      { args: [[["0"]]], expected: 0 },
      { args: [[["1", "0", "1", "0", "1"]]], expected: 3 },
      { args: [[["1", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]]], expected: 1 },
    ],
  },
  {
    id: 27,
    slug: "spiral-walk",
    title: "Spiral Walk",
    difficulty: "Medium",
    tags: ["Array", "Matrix", "Simulation"],
    description:
      "Walk through the grid `matrix` in a clockwise spiral. Start at the top-left corner, go right first, and turn inward each time you hit an edge or a visited cell. Return the values in the order you visit them.",
    examples: [{ input: "matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]", output: "[1, 2, 3, 6, 9, 8, 7, 4, 5]" }],
    constraints: ["1 <= rows, cols <= 10"],
    entry: { python: "spiral_walk", javascript: "spiralWalk" },
    starter: {
      python: "class Solution:\n    def spiral_walk(self, matrix: list[list[int]]) -> list[int]:\n        pass\n",
      javascript: "/**\n * @param {number[][]} matrix\n * @return {number[]}\n */\nfunction spiralWalk(matrix) {\n  \n}\n",
    },
    solution: {
      python:
        "class Solution:\n    def spiral_walk(self, matrix: list[list[int]]) -> list[int]:\n        out = []\n        m = [row[:] for row in matrix]\n        while m:\n            out += m.pop(0)\n            m = [list(r) for r in zip(*m)][::-1]\n        return out\n",
      javascript:
        "function spiralWalk(matrix) {\n  const out = [];\n  let top = 0, bot = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n  while (top <= bot && left <= right) {\n    for (let c = left; c <= right; c++) out.push(matrix[top][c]);\n    top++;\n    for (let r = top; r <= bot; r++) out.push(matrix[r][right]);\n    right--;\n    if (top <= bot) { for (let c = right; c >= left; c--) out.push(matrix[bot][c]); bot--; }\n    if (left <= right) { for (let r = bot; r >= top; r--) out.push(matrix[r][left]); left++; }\n  }\n  return out;\n}\n",
    },
    sampleCount: 1,
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { args: [[[7]]], expected: [7] },
      { args: [[[1], [2], [3]]], expected: [1, 2, 3] },
    ],
  },
];
