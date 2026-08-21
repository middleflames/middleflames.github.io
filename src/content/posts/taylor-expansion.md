---
author: Hao Wang
pubDatetime: 2026-08-20T23:12:00-04:00
modDatetime: 2026-08-20T23:12:00-04:00
title: Taylor Expansion
tags:
  - Math
  - Calculus
description: Deriving the Taylor polynomial from matching derivatives, extending it to multiple variables, and collecting common Maclaurin series.
---

# Background

Suppose we have a real- or complex-valued function $f(x)$ and want to approximate it near a point $x_0$ with a simpler function. What should that approximation look like?

Call the approximation $P(x)$. If $P(x)$ is similar to $f(x)$ near $x_0$, it should at least have the same value there:

$$
P(x_0)=f(x_0).
$$

If $f$ has derivatives up to order $n$, we can make the approximation more accurate near $x_0$ by matching those derivatives as well. A natural choice is an $n$th-degree polynomial:

$$
P_n(x)=\sum_{k=0}^n a_k(x-x_0)^k
=a_0+a_1(x-x_0)+a_2(x-x_0)^2+\cdots+a_n(x-x_0)^n.
$$

We require

$$
\begin{aligned}
P_n(x_0)&=f(x_0),\\
P_n'(x_0)&=f'(x_0),\\
P_n''(x_0)&=f''(x_0),\\
&\ \vdots\\
P_n^{(n)}(x_0)&=f^{(n)}(x_0).
\end{aligned}
$$

Evaluating the derivatives of $P_n$ at $x_0$ gives

$$
\begin{aligned}
a_0&=\frac{f(x_0)}{0!},\\
a_1&=\frac{f'(x_0)}{1!},\\
a_2&=\frac{f''(x_0)}{2!},\\
&\ \vdots\\
a_n&=\frac{f^{(n)}(x_0)}{n!}.
\end{aligned}
$$

Therefore, the degree-$n$ Taylor polynomial of $f$ about $x_0$ is

$$
P_n(x)=\sum_{k=0}^n \frac{f^{(k)}(x_0)}{k!}(x-x_0)^k.
$$

# Taylor series

If $f$ has derivatives of every order at $x_0$, its Taylor series about $x_0$ is

$$
\sum_{n=0}^{\infty}\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n.
$$

When this series converges to $f(x)$, we can write

$$
f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n.
$$

Infinite differentiability alone does not guarantee this equality; the Taylor series must also converge to the function. When $x_0=0$, the Taylor series is called a **Maclaurin series**.

# Matrix form

For a smooth multivariable function $f(\mathbf{x})$ evaluated near a point $\mathbf{x}_0$, the second-order Taylor approximation is

$$
f(\mathbf{x})\approx f(\mathbf{x}_0)
+\nabla f(\mathbf{x}_0)^T(\mathbf{x}-\mathbf{x}_0)
+\frac{1}{2}(\mathbf{x}-\mathbf{x}_0)^T
H_f(\mathbf{x}_0)(\mathbf{x}-\mathbf{x}_0),
$$

where $\nabla f(\mathbf{x}_0)$ is the gradient and $H_f(\mathbf{x}_0)$ is the Hessian matrix.

# Common expansions around $x=0$

$$
\begin{aligned}
e^x
&=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots,\\[4pt]

\sin x
&=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\frac{x^7}{7!}+\cdots,\\[4pt]

\cos x
&=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\frac{x^6}{6!}+\cdots,\\[4pt]

\frac{1}{1-x}
&=1+x+x^2+x^3+\cdots,
\qquad |x|<1,\\[4pt]

\frac{1}{1+x}
&=1-x+x^2-x^3+\cdots,
\qquad |x|<1,\\[4pt]

\ln(1+x)
&=x-\frac{x^2}{2}+\frac{x^3}{3}-\frac{x^4}{4}+\cdots,
\qquad -1<x\leq 1,\\[4pt]

\ln(1-x)
&=-x-\frac{x^2}{2}-\frac{x^3}{3}-\frac{x^4}{4}-\cdots,
\qquad -1\leq x<1,\\[4pt]

\arctan x
&=x-\frac{x^3}{3}+\frac{x^5}{5}-\frac{x^7}{7}+\cdots,
\qquad |x|\leq 1,\\[4pt]

\sinh x
&=x+\frac{x^3}{3!}+\frac{x^5}{5!}+\frac{x^7}{7!}+\cdots,\\[4pt]

\cosh x
&=1+\frac{x^2}{2!}+\frac{x^4}{4!}+\frac{x^6}{6!}+\cdots.
\end{aligned}
$$
