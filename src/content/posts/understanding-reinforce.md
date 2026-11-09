---
author: Hao Wang
pubDatetime: 2026-11-09T01:54:39-05:00
title: "Policy Gradient Series: Understanding the REINFORCE Algorithm"
tags:
  - Reinforcement Learning
  - Policy Gradient
description: A step-by-step derivation of REINFORCE using the log-derivative trick and sampled trajectories.
---

This is the first post in my notes on classic policy gradient algorithms.

## Preliminaries

### Markov decision process

We model the problem as a Markov decision process $(S,A,P,R,\gamma,d_0)$, where $d_0$ is the initial state distribution, $P$ is the transition kernel, $R$ is the reward distribution, and $\gamma$ is the discount factor. A trajectory $\tau=(s_1,a_1,r_1,s_2,a_2,r_2,\ldots)$ is generated as follows.

$$
\begin{aligned}
s_1 &\sim d_0 \\
a_t &\sim \pi_\theta(\cdot \mid s_t) \\
r_t &\sim R(\cdot \mid s_t,a_t) \\
s_{t+1} &\sim P(\cdot \mid s_t,a_t).
\end{aligned}
\tag{0}
$$

### The log-derivative trick

For a differentiable function $p(x;\theta)>0$, the chain rule gives

$$
\nabla_\theta \log p(x;\theta)
= \frac{\nabla_\theta p(x;\theta)}{p(x;\theta)}.
$$

When $p(x;\theta)$ is a likelihood, its log-gradient is called the score function. In REINFORCE, this identity lets us express the gradient as an expectation over trajectories.

## REINFORCE

The goal of policy gradient optimization is to find a policy $\pi$ that maximizes the expected discounted return.

$$
J(\pi) = \mathbb{E}_\pi
\left[\sum_{t=1}^{\infty}\gamma^{t-1}r_t\right].
$$

For a parameterized policy $\pi_\theta$, we can use gradient ascent with step size $\alpha$.

$$
\theta \leftarrow \theta + \alpha \nabla_\theta J(\pi_\theta).
$$

The focus of this series is **how to compute this gradient**.

For simplicity, consider a finite trajectory $\tau=(s_1,a_1,r_1,\ldots,s_H,a_H,r_H)$.

$$
\nabla_\theta J(\pi_\theta)
= \nabla_\theta \mathbb{E}_{\pi_\theta}
\left[\sum_{t=1}^{H}\gamma^{t-1}r_t\right].
\tag{1}
$$

Write the discounted return of a trajectory as $G(\tau)=\sum_{t=1}^{H}\gamma^{t-1}r_t$ and its probability under the policy as $p_\theta(\tau)$. Equation (1) becomes

$$
\nabla_\theta J(\pi_\theta)
= \nabla_\theta \mathbb{E}_{\tau\sim p_\theta}[G(\tau)].
\tag{2}
$$

For discrete trajectories, we can expand the expectation as a sum. For continuous trajectories, the corresponding expression is an integral.

$$
\nabla_\theta J(\pi_\theta)
= \nabla_\theta \sum_\tau p_\theta(\tau)G(\tau).
\tag{3}
$$

Once a trajectory is fixed, its rewards are fixed, so the gradient acts only on its probability.

$$
\nabla_\theta J(\pi_\theta)
= \sum_\tau G(\tau)\nabla_\theta p_\theta(\tau).
\tag{4}
$$

Applying the log-derivative trick gives

$$
\begin{aligned}
\nabla_\theta J(\pi_\theta)
&= \sum_\tau p_\theta(\tau)G(\tau)
\nabla_\theta \log p_\theta(\tau) \\
&= \mathbb{E}_{\tau\sim p_\theta}
\left[G(\tau)\nabla_\theta \log p_\theta(\tau)\right].
\end{aligned}
\tag{5}
$$

The return $G(\tau)$ is directly computable from the observed rewards. To compute the other factor, use the sampling process in Equation (0) to factor the trajectory probability.

$$
\begin{aligned}
p_\theta(\tau)
&= d_0(s_1)\prod_{t=1}^{H}
\pi_\theta(a_t\mid s_t) R(r_t\mid s_t,a_t) \\
&\quad {}\times \prod_{t=1}^{H-1} P(s_{t+1}\mid s_t,a_t).
\end{aligned}
$$

Taking the logarithm turns the products into sums.

$$
\begin{aligned}
\log p_\theta(\tau)
&= \log d_0(s_1) + \sum_{t=1}^{H} \log \pi_\theta(a_t\mid s_t) \\
&\quad {}+ \sum_{t=1}^{H} \log R(r_t\mid s_t,a_t) \\
&\quad {}+ \sum_{t=1}^{H-1} \log P(s_{t+1}\mid s_t,a_t).
\end{aligned}
\tag{6}
$$

Only the policy terms depend on $\theta$. This leaves

$$
\nabla_\theta \log p_\theta(\tau)
= \sum_{t=1}^{H}\nabla_\theta\log\pi_\theta(a_t\mid s_t).
$$

Substituting into Equation (5) gives the REINFORCE gradient.

$$
\nabla_\theta J(\pi_\theta)
= \mathbb{E}_{\tau\sim p_\theta}\left[
G(\tau)\sum_{t=1}^{H}\nabla_\theta\log\pi_\theta(a_t\mid s_t)
\right].
\tag{7}
$$

Equation (5) is the step that makes this practical. We can estimate Equation (7) by sampling trajectories, multiplying each trajectory’s return by the sum of its action log-probability gradients, and averaging the results. The trajectories come from the same policy whose gradient we are estimating, which makes REINFORCE an on-policy algorithm.
