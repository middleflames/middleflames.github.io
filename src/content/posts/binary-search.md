---
author: Hao Wang
pubDatetime: 2026-06-04T01:53:23-04:00
modDatetime: 2026-06-04T01:53:23-04:00
title: Binary Search
tags:
  - Algorithm
description: Notes on binary search boundaries, lower bound, upper bound, counting inequalities, and checking whether a target exists.
---

# Understanding Binary Search Conditions

## Lower Bound and Upper Bound

The lower bound is the first position where $a[i] \geq x$.
The upper bound is the first position where $a[i] > x$.

```python
i = lower_bound(a, x)
# a[0..i-1] < x
# a[i..n-1] >= x

k = upper_bound(a, x)
# a[0..k-1] <= x
# a[k..n-1] > x
```

## Summary Table

| Query  | Boundary         | Count                |
| ------ | ---------------- | -------------------- |
| `< x`  | `lower_bound(x)` | `lower_bound(x)`     |
| `<= x` | `upper_bound(x)` | `upper_bound(x)`     |
| `>= x` | `lower_bound(x)` | `n - lower_bound(x)` |
| `> x`  | `upper_bound(x)` | `n - upper_bound(x)` |

# Connection to Binary Search With a Target

## Classic Binary Search With a Target

```python
if a[mid] == target:
    found
elif a[mid] < target:
    go right
else:
    go left
```

## Binary Search With Conditions

For inequalities, we care about the boundary, not only whether $x$ exists.
For example, for `< x`:

```python
a = [1, 2, 2, 2, 4, 5]
x = 2

values:     1   2   2   2   4   5
a[i] < x:   T   F   F   F   F   F
index:      0   1   2   3   4   5
```

Instead of searching for `x`, binary search searches for the **first false / first true boundary**.

# Implementations

## Derive `< x`

How many elements are `< x`?
The condition is to find the first element that is `>= x`.

```python
def lower_bound(a, x):
    left, right = 0, len(a)

    while left < right:
        mid = (left + right) // 2
        if a[mid] >= x:
            right = mid
        else:
            left = mid + 1

    return left


ans = lower_bound(a, x)
```

## Derive `>= x`

How many elements are `>= x`?
The condition is also to find the first element that is `>= x`.

```python
def lower_bound(a, x):
    left, right = 0, len(a)

    while left < right:
        mid = (left + right) // 2
        if a[mid] >= x:
            right = mid
        else:
            left = mid + 1

    return left


ans = len(a) - lower_bound(a, x)
```

## Derive `<= x`

How many elements are `<= x`?
The condition is to find the first element that is `> x`.

```python
def upper_bound(a, x):
    left, right = 0, len(a)

    while left < right:
        mid = (left + right) // 2
        if a[mid] > x:
            right = mid
        else:
            left = mid + 1

    return left


ans = upper_bound(a, x)
```

## Derive `> x`

How many elements are `> x`?
The condition is to find the first element that is `> x`.

```python
def upper_bound(a, x):
    left, right = 0, len(a)

    while left < right:
        mid = (left + right) // 2
        if a[mid] <= x:
            left = mid + 1
        else:
            right = mid

    return left


ans = len(a) - upper_bound(a, x)
```

## What Happens if the Target Is Not There?

When the target is not there, we will have:

```python
left == right
```

This index is the boundary or insertion position.
We use `[left, right)`, so `right = len(a)` is allowed.
Returning `len(a)` means no valid element was found inside the array.

## Edge Cases

```python
# Target smaller than everything
left == right == 0

# Target larger than everything
left == right == len(a)
```

How do we make sure the correct element is found?

```python
i = lower_bound(a, x)

if i < len(a) and a[i] == x:
    x is found
else:
    x is not found
```
