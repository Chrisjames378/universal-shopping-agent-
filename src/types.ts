/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isLoading?: boolean;
}

export interface AgentStep {
  id: number;
  label: string;
  description: string;
  systemLog: string;
  status: 'idle' | 'running' | 'completed' | 'error';
}

export interface ExecutionPlan {
  intent_classification: 'purchase' | 'browse' | 'research' | 'unknown';
  extracted_constraints: {
    budget: number | null;
    currency: string | null;
    attributes: string[];
    raw_query: string;
  };
  execution_steps: Array<{
    step_id: number;
    action_type: 'NAVIGATE' | 'VISION_SCAN' | 'FILTER' | 'SELECT_ITEM' | 'ADD_TO_CART' | 'SECURE_CHECKOUT' | 'RESOLVE_CAPTCHA' | 'HUMAN_APPROVAL_WAIT';
    technical_details: string;
    target_element_desc: string;
  }>;
  risk_assessment: {
    bot_detection_probability: 'LOW' | 'MEDIUM' | 'HIGH';
    anti_bot_triggers: string[];
    requires_human_approval: boolean;
  };
}

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  registeredAt: string;
}

export interface PayPalSubscription {
  id: string;
  userId: string;
  planId: 'stealth-solo' | 'agent-cluster' | 'enterprise-unlimited';
  status: 'APPROVAL_PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  createdAt: string;
  nextPaymentDate: string;
  autoRenew: boolean;
}

export interface SubscriptionPlan {
  id: 'stealth-solo' | 'agent-cluster' | 'enterprise-unlimited';
  name: string;
  price: number;
  features: string[];
  billingCycle: 'monthly' | 'yearly';
  description: string;
}

export interface RenewalNotification {
  id: string;
  subscriptionId: string;
  timestamp: string;
  type: 'CREATED' | 'BILLING_SUCCESS' | 'BILLING_FAILED' | 'RENEWAL_WARNING' | 'CANCELLED';
  amount: number;
  message: string;
}

