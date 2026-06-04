---
author: Hao Wang
pubDatetime: 2026-02-06T21:23:00-05:00
modDatetime: 2026-02-06T21:23:00-05:00
title: Harmonic Mean
tags:
  - Math
description: A short explanation of harmonic mean, its bounds, proof, and intuition with an F1 score example.
---

# Definition

The harmonic mean $H$ of the positive real numbers $x_1,x_2,\dots x_n$ is

$$
H(x_1,x_2,\dots x_n)=\frac{n}{\frac{1}{x_1}+\frac{1}{x_2}\dots}=\frac{n}{\sum_{i=1}^n\frac{1}{x_i}}
$$

# Property

The harmonic mean is greater than or equal to the minimum of its arguments (positive arguments)

$$
\min(x_1,x_2,\dots x_n) \leq H(x_1,x_2,\dots x_n) \leq n\min(x_1,x_2,\dots x_n)
$$

The harmonic mean cannot be made arbitrarily large by changing some values to bigger ones.

## Proof

Let $m=\min(x_1,x_2,\dots x_n)$, we have

$$
\frac{1}{x_i} \leq \frac{1}{m}
$$

Sum from 1 to $n$, we have

$$
\sum_{i=1}^n\frac{1}{x_i} \leq \frac{n}{m}
$$

Take the reciprocal and multiply by n,

$$
H = \frac{n}{\sum_{i=1}^n\frac{1}{x_i}} \geq m
$$

Thus we get $\min(x_1,x_2,\dots x_n) \leq H(x_1,x_2,\dots x_n)$
For the upper bound, $x_i \geq m$, at least one $x_j = m$, then

$$
\sum_{i=1}^n\frac{1}{x_i} \geq \frac{1}{m}
$$

Take the reciprocal and multiply by n, we have

$$
H = \frac{n}{\sum_{i=1}^n\frac{1}{x_i}} \leq nm.
$$

That is

$$
H(x_1,x_2,\dots x_n) \leq n\min(x_1,x_2,\dots x_n)
$$

$$\tag*{$\blacksquare$}$$

# Insight

The key difference between harmonic mean and arithmetic mean is how it reacts with the extreme small value (see above property). It is bound to the smallest values which will reject compensation from other values.

Take the F1 score in machine learning, which is defined as the harmonic mean between precision and recall as an example, given an extreme case, $P=1.0, R=0.1$
Using the arithmetic mean we get

$$
\frac{P+R}{2} = 0.55
$$

While the harmonic mean is

$$
H(P,R) = \frac{2}{\frac{1}{P}+\frac{1}{R}} = 0.18
$$

Above shows that the harmonic mean will not be large simply because the precision is high enough.
