---
author: Hao Wang
pubDatetime: 2026-01-22T00:00:00-05:00
modDatetime: 2026-02-06T00:00:00-05:00
title: Understanding LoRA
tags:
  - LLM
description: An overview of LoRA low-rank adaptation, efficient implementation, memory benefits, and initialization choices.
---

# What is LoRA?

LoRA is a Parameter-Efficient Fine-Tuning (PEFT) Method that uses low-rank approximation (LoRA) to reduce the computational cost of fine-tuning LLMs.
By applying low-rank decomposition, LoRA fine-tunes LLMs by updating a small set of parameters, which are more memory-efficient and computationally efficient than updating all parameters (full-fine-tuning).

# Introduction to LoRA

## Key Assumptions

LoRA assumes that the intrinsic dimension of the LLM for each sub-task is small, despite the fact that the number of total parameters is large.
Based on this assumption, LoRA uses a low-rank approximation to reduce the computational cost of fine-tuning LLMs.

## LoRA Algorithm

Let $W$ be the parameter matrix of the LLM.
For the full-fine-tuning, the update rule is:

$$
W^{t+1} = W^t + \Delta W,
$$

when $W\in \mathbb{R}^{d\times d}$ is a large matrix, it requires both computation and memory to do the update.

As for LoRA, it uses $A\in \mathbb{R}^{d\times r}, B\in \mathbb{R}^{r\times d}$ to replace the $\Delta W$.
The update rule is:

$$
W^{t+1} = W^t + AB,
$$

where $A$ and $B$ are the low-rank approximations of $\Delta W$, $r\ll \max\{d,k\}$.
In practice, $A$ is initialized with Gaussian distribution, and $B$ is initialized with zeros.

# LoRA Analysis

Naively implementing the LoRA will not save the day.

## Naive Implementation

For the naive implementation, the update rule is:

$$
Y = XW = X(W_0 + AB),
$$

where $X\in \mathbb{R}^{b \times n}$ is the input matrix.

We can get the gradient of $A,B$ by back-propagation.

$$
\frac{\partial L}{\partial A} = \frac{\partial L}{\partial W}B^T,
\frac{\partial L}{\partial B} = A^T\frac{\partial L}{\partial W}.
$$

Obviously, it requires the entire $W$ to compute the gradient, which is not efficient.

## Efficient Implementation

Set the intermediate result $Z=XA \in \mathbb{R}^{b\times r}$, we have:

$$
Y = XW_0 + XAB = XW_0 + ZB.
$$

Now the gradient is:

$$
\frac{\partial L}{\partial A} = X^T\frac{\partial L}{\partial Z},
\frac{\partial L}{\partial B} = Z^T\frac{\partial L}{\partial Y}.
$$

Now it will save the memory and computation cost.

## Memory Analysis

For the backbone model, it saves the memory cost, especially the first-order and second-order gradients for optimizers like Adam.
Additionally, the backbone model can be quantized into INT8 or even INT4 as it does not require updates.

LoRA also saves the communication cost across GPUs.

## Initialization Choice

One of the frequently asked question is how to initialize $A,B$.

Let us think about this step by step.

- First, can't initialize both matrices with 0. Because this will lead to 0 gradients.
- Second, can't initialize both $A,B$ with Gaussian distribution. Because this may lead to high $\Delta W$, resulting deviation from the pre-trained model at the very first step.
- Third, with $A$ initialized with Gaussian distribution, the $B$ can be initialized with zeros. $B$ can still get gradients while the initial $\Delta W$ is 0 at the beginning.
- Finally, there is no rules that $B$ cant be initialized with Gaussian distribution as $A$ to be zeros. Some paper claims that $A$ to be Gaussian distribution is better but there is no guarantee.
