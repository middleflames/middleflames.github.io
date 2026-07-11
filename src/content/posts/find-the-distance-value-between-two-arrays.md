---
author: Hao Wang
pubDatetime: 2026-07-10T16:40:13-04:00
modDatetime: 2026-07-10T22:47:15-04:00
title: Find the Distance Value Between Two Arrays
tags:
  - Algorithm
  - LeetCode
description: Two ways to solve LeetCode 1385 using binary search or two pointers, with boundary reasoning and complexity analysis.
---

# Find the Distance Value Between Two Arrays

## Description

Given two integer arrays `arr1` and `arr2`, and the integer `d`, *return the distance value between the two arrays*.

The distance value is defined as the number of elements `arr1[i]` such that there is not any element `arr2[j]` where `|arr1[i]-arr2[j]| <= d`.

**Example 1:**

**Input:** arr1 = [4,5,8], arr2 = [10,9,1,8], d = 2  
**Output:** 2  
**Explanation:**  
For arr1[0]=4 we have:  
|4-10|=6 > d=2  
|4-9|=5 > d=2  
|4-1|=3 > d=2  
|4-8|=4 > d=2  
For arr1[1]=5 we have:  
|5-10|=5 > d=2  
|5-9|=4 > d=2  
|5-1|=4 > d=2  
|5-8|=3 > d=2  
For arr1[2]=8 we have:  
|8-10|=2 <= d=2  
|8-9|=1 <= d=2  
|8-1|=7 > d=2  
|8-8|=0 <= d=2

## Approach 1: Binary Search

For each value $x$ in `arr1`, the forbidden interval in `arr2` is:

$$
[x-d, x+d].
$$

After sorting `arr2`, use binary search to find the first element greater than or equal to $x-d$. If that element does not exist, or if it is greater than $x+d$, then no value lies in the forbidden interval and $x$ is valid.

```python
from typing import List


class Solution:
    def findTheDistanceValue(
        self, arr1: List[int], arr2: List[int], d: int
    ) -> int:
        arr2.sort()
        answer = 0

        for x in arr1:
            index = self.lower_bound(arr2, x - d)
            if index == len(arr2) or arr2[index] > x + d:
                answer += 1

        return answer

    def lower_bound(self, arr: List[int], target: int) -> int:
        left, right = 0, len(arr)

        while left < right:
            mid = (left + right) // 2
            if arr[mid] >= target:
                right = mid
            else:
                left = mid + 1

        return left
```

Let $n = \lvert\text{arr1}\rvert$ and $m = \lvert\text{arr2}\rvert$.

- Time: $O(m\log m + n\log m)$
- Extra space: $O(1)$, excluding the sorting implementation's internal stack

## Approach 2: Two Pointers

If both arrays are sorted, we can process `arr1` from left to right while maintaining a pointer `j` in `arr2`.

For each $x$ in `arr1`, advance `j` past every value smaller than $x-d`. When the pointer stops:

- If `j` has reached the end of `arr2`, every remaining value is too small, so $x$ is valid.
- If `arr2[j] > x+d`, the first value not below the interval is already above it, so $x$ is valid.
- Otherwise, `arr2[j]` lies in $[x-d, x+d]$, so $x$ is invalid.

The pointer never moves backward. Because `arr1` is sorted, the lower bound $x-d$ can only stay the same or increase.

```python
from typing import List


class Solution:
    def findTheDistanceValue(
        self, arr1: List[int], arr2: List[int], d: int
    ) -> int:
        arr1.sort()
        arr2.sort()

        answer = 0
        j = 0

        for x in arr1:
            while j < len(arr2) and arr2[j] < x - d:
                j += 1

            if j == len(arr2) or arr2[j] > x + d:
                answer += 1

        return answer
```

- Time: $O(n\log n + m\log m)$
- Extra space: $O(1)$, excluding the sorting implementation's internal stack

## Takeaway

Both approaches test whether the sorted `arr2` contains a value in the closed interval $[x-d, x+d]$. Binary search performs an independent lookup for each value in `arr1`; the two-pointer approach gains a linear scan after sorting by reusing the position found for the previous value.
