---
author: Hao Wang
pubDatetime: 2026-09-03T00:08:32-04:00
modDatetime: 2026-09-03T00:08:32-04:00
title: Two Important Vector Inequalities
tags:
  - Math
  - Linear Algebra
description: Proofs of the Cauchy–Schwarz inequality and the triangle inequality for vectors in Euclidean space.
---

# Cauchy–Schwarz inequality

## Proposition 1

For any $\mathbf{x},\mathbf{y}\in\mathbb{R}^n$,

$$
|\mathbf{x}\cdot\mathbf{y}|\leq \|\mathbf{x}\|\,\|\mathbf{y}\|.
$$

## Proof

If either vector is zero, both sides are zero and the inequality holds. Otherwise, define the unit vectors

$$
\mathbf{a}=\frac{\mathbf{x}}{\|\mathbf{x}\|}
\qquad\text{and}\qquad
\mathbf{b}=\frac{\mathbf{y}}{\|\mathbf{y}\|}.
$$

Because squared norms are nonnegative,

$$
\begin{aligned}
\|\mathbf{a}+\mathbf{b}\|^2
&=\|\mathbf{a}\|^2+2\mathbf{a}\cdot\mathbf{b}+\|\mathbf{b}\|^2\\
&=2+2\mathbf{a}\cdot\mathbf{b}\geq 0,
\end{aligned}
$$

so $\mathbf{a}\cdot\mathbf{b}\geq -1$. Similarly,

$$
\|\mathbf{a}-\mathbf{b}\|^2
=2-2\mathbf{a}\cdot\mathbf{b}\geq 0,
$$

which gives $\mathbf{a}\cdot\mathbf{b}\leq 1$. Therefore,

$$
-1\leq \mathbf{a}\cdot\mathbf{b}\leq 1.
$$

Substituting the definitions of $\mathbf{a}$ and $\mathbf{b}$,

$$
\left|
\frac{\mathbf{x}\cdot\mathbf{y}}
{\|\mathbf{x}\|\,\|\mathbf{y}\|}
\right|\leq 1,
$$

and hence

$$
|\mathbf{x}\cdot\mathbf{y}|\leq \|\mathbf{x}\|\,\|\mathbf{y}\|.
\tag*{$\square$}
$$

# Triangle inequality

## Proposition 2

For any $\mathbf{x},\mathbf{y}\in\mathbb{R}^n$,

$$
\|\mathbf{x}+\mathbf{y}\|\leq \|\mathbf{x}\|+\|\mathbf{y}\|.
$$

## Proof

Expanding the squared norm and applying the Cauchy–Schwarz inequality,

$$
\begin{aligned}
\|\mathbf{x}+\mathbf{y}\|^2
&=(\mathbf{x}+\mathbf{y})\cdot(\mathbf{x}+\mathbf{y})\\
&=\|\mathbf{x}\|^2+\|\mathbf{y}\|^2+2\mathbf{x}\cdot\mathbf{y}\\
&\leq \|\mathbf{x}\|^2+\|\mathbf{y}\|^2
+2\|\mathbf{x}\|\,\|\mathbf{y}\|\\
&=(\|\mathbf{x}\|+\|\mathbf{y}\|)^2.
\end{aligned}
$$

Both sides are nonnegative, so taking square roots gives

$$
\|\mathbf{x}+\mathbf{y}\|\leq \|\mathbf{x}\|+\|\mathbf{y}\|.
\tag*{$\square$}
$$
