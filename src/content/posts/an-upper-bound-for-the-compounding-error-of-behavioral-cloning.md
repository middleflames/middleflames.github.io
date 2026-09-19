---
author: Hao Wang
pubDatetime: 2026-09-18T00:00:00-04:00
title: An Upper Bound for the Compounding Error of Behavioral Cloning
tags:
  - Robotics
description: An upper-bound analysis of compounding errors in behavioral cloning.
---

# Definition of Behavioral Cloning

Behavioral cloning is a kind of imitation learning that collects expert trajectories:

$$
\mathcal{D}_{\text{train}}=\{(s_1,a_1^*),(s_2,a_2^*), \dots \}, \tag{1}
$$

where $s_t$ is the state at time $t$ and $a_t$ is the expert's action.
The training objective is

$$
\min_{\theta}
\mathbb{E}_{s \sim d_{\pi^*}}
\left[
\ell\left(\pi_\theta(s), \pi^*(s)\right)
\right], \tag{2}
$$

where $\theta$ represents the learnable parameters and $\pi_\theta$ is the learned policy.

# Mistake Analysis

One of the main differences between behavioral cloning and supervised learning is that a small error can propagate through the predicted action sequence and grow exponentially, whereas supervised learning assumes that the data samples are $i.i.d.$

The root cause of this error is the **train-test distribution shift**. In the test environment, if the model makes one mistake at a step, it will enter a state that was rarely or never seen in the training distribution. The model may not know how to react in this state, so the probability of making another mistake may increase and errors may accumulate.

Formally, we can assume that the error at each step is bounded by $\epsilon$:

$$
P\left(\pi_\theta(s) \neq \pi^*(s) \mid s\right) \leq \epsilon \tag{3}
$$

The cost of a mistake can be represented by

$$
c(s,a) =
\begin{cases}
0, & \text{if } a = \pi^*(s),\\
1, & \text{otherwise}.
\end{cases} \tag{4}
$$

Given a horizon $T$, the total mistake cost is

$$
J(\pi_\theta) =
\mathbb{E}\left[
\sum_{t=1}^{T} c(s_t, a_t)
\right]. \tag{5}
$$

Let $F$ denote the time step at which the learned policy makes its first mistake. Then

$$
P(F=1) = \epsilon \tag{6}
$$

For $F=2$, the policy makes no mistake at the first time step and makes a mistake at the second time step. Thus,

$$
P(F=2) = (1-\epsilon)\epsilon \tag{7}
$$

More generally,

$$
P(F=t) = (1-\epsilon)^{t-1}\epsilon \tag{8}
$$

The total cost $J(\pi_\theta)$ is bounded by

$$
J(\pi_\theta)
\leq
\sum_{t=1}^{T}
(1-\epsilon)^{t-1}
\cdot \epsilon (T-t+1). \tag{9}
$$

The bound above considers the worst case: after one mistake, the policy makes mistakes at all remaining steps. $(T-t+1)$ denotes the number of decisions remaining from time $t$ onward.

Since $(1-\epsilon)^{t-1} \leq 1$, we have

$$
J(\pi_\theta)
\leq \sum_{t=1}^{T} \epsilon (T-t+1) = \epsilon \sum_{t=1}^{T}  (T-t+1) =  \epsilon (T + T(-1)\dots 1)= \epsilon\frac{T(T+1)}{2}. \tag{10}
$$

Finally,

$$
J(\pi_\theta) = O(\epsilon T^2) \tag{11}
$$

$\square$
