export interface TankBankX402Config {
  gameId: string;
  developerId: string;
  apiEndpoint?: string;
  network?: 'mainnet' | 'devnet';
  pricePerSecond?: number;
  walletAdapter?: any;
  autoRetry?: boolean;
  maxRetries?: number;
}

export interface PaymentSession {
  id: string;
  gameId: string;
  walletAddress: string;
  startTime: number;
  totalCost: number;
  status: 'active' | 'ended' | 'failed';
  lastHeartbeat?: number;
}

export interface PaymentToken {
  token: string;
  expiresAt: number;
  amount: number;
  gameId: string;
  sessionId: string;
}

export interface PaymentRequiredHeaders {
  'x-payment-required': string;
  'x-payment-amount': string;
  'x-payment-currency': string;
  'x-payment-endpoint': string;
  'x-payment-gameid': string;
  'x-payment-session'?: string;
}

export interface SessionStartRequest {
  gameId: string;
  developerId: string;
  walletAddress: string;
  pricePerSecond: number;
}

export interface SessionStartResponse {
  session: PaymentSession;
  success: boolean;
  error?: string;
}

export interface PaymentVerificationRequest {
  token: string;
  gameId: string;
  amount: number;
}

export interface PaymentVerificationResponse {
  valid: boolean;
  sessionId: string;
  walletAddress: string;
  error?: string;
}

export interface HeartbeatRequest {
  sessionId: string;
  tankAmount: number;
}

export interface HeartbeatResponse {
  success: boolean;
  session: PaymentSession;
  error?: string;
}

export interface TankBankError {
  code: string;
  message: string;
  details?: any;
}

export type EventType =
  | 'session-started'
  | 'session-ended'
  | 'payment-processed'
  | 'payment-failed'
  | 'error';

export interface TankBankEvent {
  type: EventType;
  data: any;
  timestamp: number;
}